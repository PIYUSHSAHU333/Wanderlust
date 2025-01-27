const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressErr = require("../utils/ExpressErr.js");
const {listingSchema, reviewSchema} = require("../schema.js");
//For validating schema of listing if req sent from server side using api tools like hopscotch
const validateListing = (req,res,next)=>{
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

//Listing route 
//root 
router.get("/home", (req, res)=>{
    res.send("Hi, I am root!");
});
//show route
router.get("/", asyncWrap( async (req, res)=>{
    let allListings = await Listing.find({})
    res.render("listings/home.ejs", {allListings});
}))
//Testing route
router.get("/testListing", asyncWrap (async (req, res)=>{
    const list1 = new Listing ({
    title: "My home",
    description: "Available for rent",
    location: "Jhansi, UttarPradesh"
    });  
    await list1.save();
    res.send("Test successful")
}));

//New route
router.get("/new", (req, res)=>{
    req.session.name = "rahul";
    res.render("listings/new.ejs");
});

//Create route
router.post("/",
    validateListing,  //applied middleware so that testing would be done for validating!
    asyncWrap( async (req, res, next)=>{
    let newListing =  new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})
);

//show route (read)
router.get("/:id", asyncWrap (async (req, res)=>{
    // console.log(req.session);
    let {id} = req.params;
    let specificList = await Listing.findById(id).populate("review");
    if(!specificList){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/specificList.ejs", {specificList});
}));

//Edit route
router.get("/:id/update", asyncWrap (async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update route
router.put("/:id",
    validateListing, //applied middleware so that testing would be done for validating schema for listing if req sent from server side!
    asyncWrap (async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})// just ask chatGpt 

    req.flash("success", "Listing Updated Successfuly");
    res.redirect("/listings");
})
);

//delete route
router.delete("/:id", asyncWrap (async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id); //also when we'll delete a listing, then post query middleware will be running which we've set to delete related reviews in review db in listing.js
    console.log(listing);
    req.flash("success", "Listing Deleted Successfuly");
    res.redirect("/listings");
}));

module.exports = router;