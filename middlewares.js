const Listing = require('./models/listing.js'); // Adjust the path as needed
const ExpressErr = require("./utils/ExpressErr.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedin = (req, res, next)=>{
    console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl //if we're not logged in, then only we need this original url bc then we have to first go to login page and then from there after login is done we need this originalUrl, in other case where we are already looged in we don't need originalUrl bc directly next() will be called (in isLoggedin)
        req.flash("error", "You must be loged in");
       return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    //Now see actually passport doesn't have access to res.locals so even if after login our session gets reset our redirectUrl will already we saved bc we'll call it before authentication or loggin in successfully
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont've permission for requested action!");
        return res.redirect(`/listings/${id}`); //important to return, otherwise other operations will still be executed
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let id = req.params.reviewid;
    let listingId = req.params.id
    let review = await Review.findById(id);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont've permission for requested action!");
        return res.redirect(`/listings/${listingId}`); //important to return, otherwise other operations will still be executed
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{  //For validating schema of listing if req sent from server side using api tools like hopscotch
    let {error} = listingSchema.validate(req.body); //returns an object
    console.log(error);
    if(error){
        let errMsg = error.details.map((err) => err.message).join(",");
        throw new ExpressErr(400, errMsg);
    }
else{
    next();
}
};
module.exports.validateReview = (req, res, next)=>{ //For validating schema of review if req sent from server side using api tools like hopscotch
    let {error} = reviewSchema.validate(req.body); 
    // console.log(error);
    if(error){
        let errMsg = error.details.map((err)=> err.message).join(",");
        throw new ExpressErr(400, errMsg);
    }else{
        next();
    }
}