const express = require("express"); 
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateBooking} = require("../middlewares.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const {sendMail, formatTimeDate} = require("../utils/mail.js");


router.route("/")
.get(isLoggedin,asyncWrap(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    console.log(id);
    const key = process.env.RAZORPAY_KEY
    res.render("listings/booking", {id, listing, key})
}))
.post(validateBooking,asyncWrap(async(req, res)=>{
    const {id} = req.params;
    // console.log("Here=>",req.body.booking)
    const {email, checkIn, checkOut} = req.body.booking;
    let newBooking = new Booking(req.body.booking);
    console.log("----->",newBooking);
    const listing = await Listing.findById(id);
    if(!listing){ //if somebody gives wrong id through route or any api tool
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
}
   const listingTitle = listing.title
   newBooking.Listing = listing;
   newBooking.isPayment = true;
   newBooking.user = res.locals.currUser;
   await newBooking.save();
   const checkInDateTime = formatTimeDate(checkIn);
//    console.log(checkInDateTime)
   const checkOutDateTime = formatTimeDate(checkOut);
   await sendMail(email, "Booking confirmation", `Your booking for ${listingTitle} is confirmed.\n\nCheckIn-${checkInDateTime} \n CheckOut- ${checkOutDateTime} \n\n\n ~Wanderlust`);
   req.flash("success", "Booking confirmed successfully! Have a nice stay :)");
   await sendNotification(res.locals.currUser._id, `Booking for ${listingTitle} has been confirmed`);
   res.redirect("/listings")
}));

module.exports = router;