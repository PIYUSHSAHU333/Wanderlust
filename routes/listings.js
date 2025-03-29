const express = require("express"); 
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressErr = require("../utils/ExpressErr.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedin, isOwner, validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');//middleware for handling multipart/form-data 
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //specifying where our file would be saved| before it was like this, when we didnt had cloudinary a/c: multer({ dest: 'uploads/' })
//Listing route 
//root 
router.get("/home", (req, res)=>{
    res.send("Hi, I am root!");
});

//index route and create new listing(post);
router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedin,
    upload.single('listing[image]'),
    validateListing,  //applied middleware so that testing would be done for validating!
    asyncWrap(listingController.newListing)
);
// for current booking sof a user
router.get("/myBookings", isLoggedin, listingController.currentBooking);

//for search bar(not so advanced but still😉);
router.get("/search",
    asyncWrap(listingController.search)
)
//wishlist
router.get("/wishlist",
    isLoggedin,
    asyncWrap( listingController.renderWishlist)
)

//New route
router.get("/new",isLoggedin, listingController.renderNewForm );

//Edit route
router.get("/:id/update", 
    isLoggedin,
    isOwner,
    asyncWrap (listingController.renderEditForm));

//Show route, Update route, Destroy route
router.route("/:id")
.get( asyncWrap (listingController.showListing))
.put(  isLoggedin,
    isOwner, //protecting from server sides
    upload.single('listing[image]'),
    validateListing, //applied middleware so that testing would be done for validating schema for listing if req sent from server side! (from api tools maybe)
    asyncWrap (listingController.updateListing))
.delete( isLoggedin,
    isOwner,
    asyncWrap (listingController.deleteListing))


router.route("/filters/:category")
.get(asyncWrap(listingController.filter))

module.exports = router;