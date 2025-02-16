const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.uploadReview = async(req, res)=>{
    console.log(req.params);
    const review = new Review(req.body.review); 
    let listing = await Listing.findById(req.params.id);
    listing.review.push(review);
    review.author = res.locals.currUser;
    await review.save();
    // review.listingId = req.params.id //how about this? this question is for - ChatGpt!! for creating fk in reviews for listing
    await listing.save();
    req.flash("success", "Review added successfuly");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull :{review : reviewid}});//In listing model's documnet when for a particular id's review array we'll pull(delete) the element which will have reviewId
    req.flash("success", "Review deleted successfuly");
    res.redirect(`/listings/${id}`);
}