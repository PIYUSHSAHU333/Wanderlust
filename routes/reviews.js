const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateReview, isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");
//reviews

//post review route
router.post("/",
    isLoggedin,
    validateReview, //applied middleware so that testing would be done for validating schema for reviews if req sent from server side!
    asyncWrap (reviewController.uploadReview));


//delete review route
router.delete("/:reviewid",
    isLoggedin,
    isReviewAuthor,
    asyncWrap(reviewController.deleteReview));
module.exports = router;

