const { model } = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/users");
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //requiring geocodingg service from sk package which we downloaded
const geocodingClient =  geocoding({ accessToken: process.env.MAP_TOKEN }); //connects service(i.e geocoding here) with api of mapbox
const Booking = require("../models/booking");
const sendNotification = require("../utils/notifiation");
module.exports.index = async (req, res)=>{
    let allListings = await Listing.find({})
    let currUser = null;
    if(res.locals.currUser != undefined){
         currUser = await User.findById(res.locals.currUser._id)
    }
    res.render("listings/home.ejs", {allListings, currUser});
}

module.exports.renderNewForm = (req, res)=>{
    // req.session.name = "rahul"; //req has a key named session which is an object inside which there is another object as key - cookies 
    res.render("listings/new.ejs");
}

module.exports.newListing = async (req, res, next)=>{

   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        // console.log("--------------!!!!!-------",response.body.features[0].geometry);
        // res.send("done");
    if (!req.file) {
        req.flash("error", "Image upload is required.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename

    let newListing =  new Listing(req.body.listing);
    newListing.owner = req.user; //no need to req.user._id bc schema.types.objectId only stores objectId only 
    newListing.image = {url, filename} //It's also a format in which simply we can just assign values
    newListing.geometry = response.body.features[0].geometry //assigning newListing's geometry object the geometry object that we recieved from mapbox's geocodeservice
    await newListing.save();
    sendNotification(res.locals.currUser._id, "New listing has been listed successfully");
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}
 
module.exports.renderWishlist = async(req, res)=>{
    const userId = res.locals.currUser._id
    const user = await User.findById(userId).populate("wishlist");
    console.log("user.wishlist=>",user.wishlist);
    res.render("listings/wishlist.ejs", {user})
}

module.exports.showListing = async (req, res)=>{
    //console.log(req.session);
    // console.log(req.user);
    let {id} = req.params;
    let specificList = await Listing.findById(id)
    // let name = res.locals.currUser.username ///////
    .populate({path: "review",
        populate: {
            path: "author",
        },
    })                                       //nesting populate💀 
    .populate("owner");
    if(!specificList){
        req.flash("error", "Listing you requested for does not exists!"); //when let'say we directly copy an ivalid id and paste it with url, then this comes into help
        res.redirect("/listings");
     }
    // console.log(specificList.image.url);
    res.render("listings/specificList.ejs", {specificList});
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){ //if somebody gives wrong id through route or any api tool
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        // console.log("--------------!!!!!-------",response.body.features[0].geometry);
        // res.send("done");

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})// just ask chatGpt 
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }
    listing.geometry = response.body.features[0].geometry
    await listing.save();
    sendNotification(res.locals.currUser._id, "Your listing details have been updated ")
    req.flash("success", "Listing Updated Successfuly");
    res.redirect("/listings");
}

module.exports.deleteListing = async (req, res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id); //also when we'll delete a listing, then post query middleware will be running which we've set to delete related reviews in review db in listing.js
    console.log(listing);
    req.flash("success", "Listing Deleted Successfuly");
    sendNotification(res.locals.currUser._id,"Your listing has been deleted");
    res.redirect("/listings");
}

module.exports.filter = async (req, res)=>{
    let {category} = req.params;
    let filteredListings = await Listing.find({category: category}); 
    // console.log("-----",filteredListings,"-----");
    res.render("listings/filters.ejs", {filteredListings});
}
module.exports.search = async(req, res)=>{
    let {query} = req.query;
    let listings = await Listing.find({
        $or: [
            {title: {$regex: query, $options: 'i'}},
            {location: {$regex: query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}}
        ],
    });
    // console.log("------------Triggered", listings, "-------------Triggered")
    res.render("listings/searchedListing.ejs", {listings}); 
}
module.exports.currentBooking = async(req, res)=>{
    const myBookings = await Booking.find({user : res.locals.currUser._id}).populate("Listing");
    console.log("All of my bookings",myBookings)
    // res.send("ok")
    res.render("listings/myBookings", {myBookings})
}