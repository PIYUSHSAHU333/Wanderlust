const express = require("express");
const ExpressErr = require("./utils/ExpressErr.js");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const { title } = require("process");
const { url } = require("inspector");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const reviews = require("./models/reviews.js");
const listing = require("./models/listing");

//-----------------------------------------
app.set("Views", path.join(__dirname, "Views"));
app.set("Views engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static('public'));

//-----------------------------------------
main()
.then((res)=>{
    console.log("Mongoose connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

//..........................
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

//--------------------------
//Listing route 
//root 
app.get("/", (req, res)=>{
    res.send("Hi, I am root!");
});
//show route
app.get("/listings", asyncWrap( async (req, res)=>{
    let allListings = await Listing.find({})
    res.render("listings/home.ejs", {allListings});
}))
//Testing route
app.get("/testListing", asyncWrap (async (req, res)=>{
    const list1 = new Listing ({
    title: "My home",
    description: "Available for rent",
    location: "Jhansi, UttarPradesh"
    });  
    await list1.save();
    res.send("Test successful")
}));

//New route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//Create route
app.post("/listings",
    validateListing,  //applied middleware so that testing would be done for validating!
    asyncWrap( async (req, res, next)=>{
    let newListing =  new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

//show route (read)
app.get("/listings/:id", asyncWrap (async (req, res)=>{
    let {id} = req.params;
    let specificList = await Listing.findById(id).populate("review");
    res.render("listings/specificList.ejs", {specificList});
}));

//Edit route
app.get("/listing/:id/update", asyncWrap (async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update route
app.put("/listing/:id",
    validateListing, //applied middleware so that testing would be done for validating schema for listing if req sent from server side!
    asyncWrap (async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})// just ask chatGpt 
    res.redirect("/listings");
})
);

//delete route
app.delete("/listings/:id", asyncWrap (async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id); //also when we'll delete a listing, then post query middleware will be running which we've set to delete related reviews in review db in listing.js
    console.log(listing);
    res.redirect("/listings");
}));

//reviews
//post review route
app.post("/listings/:id/reviews",
    validateReview, //applied middleware so that testing would be done for validating schema for reviews if req sent from server side!
    asyncWrap (async(req, res)=>{
    const review = new Review(req.body.review);
    let listing = await Listing.findById(req.params.id);
    listing.review.push(review);
    await review.save();
    review.listingId = req.params.id //how about this? this question is for - ChatGpt!! 
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));


//delete review route
app.delete("/listings/:id/reviews/:reviewid", asyncWrap(async(req, res)=>{
    let {id, reviewid} = req.params;
    await reviews.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull :{review : reviewid}});//In listing model's documnet when for a particular id's review array we'll pull(delete) the element which will have reviewId
    res.redirect(`/listings/${id}`);
}));

//Invalid route handler
app.use((req, res, next)=>{
   throw new ExpressErr(401, "Page not found");
});

//!!Error Handling Middlewares!!
app.use((err, req, res, next)=>{
   let {status = 500, message = "Some error occured" } = err;
   res.status(status).render("error.ejs", {message});
//    res.status(status).send(message);
});

//-----------------------
app.listen("8080", (req, res)=>{
    console.log("Server is listening to port 8080");
});


