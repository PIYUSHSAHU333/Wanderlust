const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const {isLoggedin} = require("../middlewares.js");
const Listing = require("../models/listing.js");
const { route } = require("./listings.js");
const Message = require("../models/messages.js")
const ChatRoom = require("../models/chatRoom.js");


router.get("/create-room", isLoggedin, asyncWrap(async(req, res)=>{
    const userAId = res.locals.currUser._id; //current user who clicks on chat with host;
    const userBId = req.body.hostId;                        //owner of listing;
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
route.get("/:roomId", asyncWrap(async(req, res)=>{
    const {roomId} = req.params;

    const chatRoom = await ChatRoom.findOne({roomId});
    if(!chatRoom){
        return res.status(404).send("Chat Room not found");
    } 

    const {userAId, userBId} = chatRoom;
    //get both userAid and userBid
    

    //fetching all req where two user are either sender or receiver;
    let messages = await Message.find({
        $or: [
            {sender: userAId, receiver: userBId},
            {sender: userBId, receiver: userAId}
        ]
    }).sort({createdAt: -1});

    res.render("chats/chat.ejs", {roomId, messages: messages || [], userId: res.locals.currUser._id})// ensures if at starting no matches are there then message is just an empty array
}))

module.exports = router;