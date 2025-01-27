const express = require("express");

const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");


//For validating schema of review if req sent from server side using api tools like hopscotch
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMsg = error.details.map((err)=> err.message).join(",");
        throw new ExpressErr(400, errMsg);
    }else{
        next();
    }
}

//reviews
//post review route
router.post("/",
    validateReview, //applied middleware so that testing would be done for validating schema for reviews if req sent from server side!
    asyncWrap (async(req, res)=>{
    console.log(req.params);
    const review = new Review(req.body.review); 
    let listing = await Listing.findById(req.params.id);
    listing.review.push(review);
    await review.save();
    // review.listingId = req.params.id //how about this? this question is for - ChatGpt!! for creating fk in reviews for listing
    await listing.save();
    req.flash("success", "Review added successfuly");
    res.redirect(`/listings/${listing._id}`);
}));


//delete review route
router.delete("/:reviewid", asyncWrap(async(req, res)=>{
    let {id, reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull :{review : reviewid}});//In listing model's documnet when for a particular id's review array we'll pull(delete) the element which will have reviewId
    req.flash("success", "Review deleted successfuly");
    res.redirect(`/listings/${id}`);
}));
module.exports = router;

