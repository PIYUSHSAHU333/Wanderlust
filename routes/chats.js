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
    const userBID = req.body.hostId;                        //owner of listing;
    const roomId = [userAId, hostId].sort().join("_");

    //checking if chatRoom already exists;
    let chatRoom =await ChatRoom.findOne({roomId});

    if(!chatRoom){
        chatRoom = new ChatRoom({
            roomId,
            userAId,
            userBID
        });
        await chatRoom.save();
    }

    res.json({success: true, roomId : chatRoom.roomId});

}))
router.get("/:listingid",isLoggedin, asyncWrap(async(req, res)=>{
    const {listingid} = req.params;
    const listing = await Listing.findById(listingid);
    const listingOwner = listing.owner;
    const userId = res.locals.currUser._id;

    const messages = await Message.find({
        listing: listingid,
        $or : 
        [
            {sender: listingOwner, receiver: userId},
            {sender: userId, receiver: listingOwner}
        ]
    }).sort({createdAt:-1});

res.render("chats/chat.ejs", {listingid, listingOwner, userId, messages})
    // const listing = await Listing.findById(listingid).populate("owner");
}));

module.exports = router;