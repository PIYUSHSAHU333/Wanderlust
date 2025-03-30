const Notification = require("../models/notification.js");

async function sendNotification(userId, message){
    try{
        const notification = new Notification({user: userId, message: message});
        await notification.save();
    }catch(e){
        console.log("Error in sending noification", e);
    }
}

module.exports = sendNotification;