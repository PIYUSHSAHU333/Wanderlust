const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const {isLoggedin} = require("../middlewares.js");
const Listing = require("../models/listing.js");
const { route } = require("./listings.js");
const mongoose = require("mongoose");
const Message = require("../models/messages.js")
const ChatRoom = require("../models/chatRoom.js");

router.get("/messages", asyncWrap(async(req, res)=>{
    const currUser = res.locals.currUser._id;
    const chatRoom =await  ChatRoom.find({
        $or: [
            {userAId: res.locals.currUser._id},
            {userBId: res.locals.currUser._id}
        ]
    }).populate("userAId").populate("userBId").sort({ updatedAt: -1 });
    console.log(chatRoom);
    res.render("chats/messages.ejs", {chatRoom, currUser});
}))


router.post("/create-room",  asyncWrap(async(req, res)=>{
    const userAId = res.locals.currUser._id; //current user who clicks on "chat with host";
    const userBId = req.body.hostId;                        //owner of listing;
    console.log("userId", userBId);
    const roomId = [userAId, userBId].sort().join("_");

    //checking if chatRoom already exists;
    let chatRoom =await ChatRoom.findOne({roomId});

    if(!chatRoom){
        chatRoom = new ChatRoom({
            roomId,
            userAId,
            userBId
        });
        await chatRoom.save();
    }

    res.json({success: true, roomId : chatRoom.roomId});

}))
router.get("/:roomId", asyncWrap(async(req, res)=>{
    const {roomId} = req.params;

    const chatRoom = await ChatRoom.findOne({roomId});
    if(!chatRoom){
        return res.status(404).send("Chat Room not found");
    } 

    const {userAId, userBId} = chatRoom;
    //get both userAid and userBid
    

    //fetching all req where two user are either sender or receiver;
    let messages = await Message.find({
        roomId,
    }).sort({createdAt: 1});

    // console.log("messages =>>", messages);

    // console.log("data from /:roomId",messages , "|", res.locals.currUser._id);
    res.render("chats/chat.ejs", {roomId, messages: messages || [], userId: res.locals.currUser._id})// ensures if at starting no matches are there then message is just an empty array
}))

module.exports = router;