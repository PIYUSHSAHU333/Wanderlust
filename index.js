const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { title } = require("process");
const { url } = require("inspector");
const methodOverride = require('method-override')

//-----------------------------------------
app.set("Views", path.join(__dirname, "Views"));
app.set("Views engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
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

//--------------------------
//Listing route 
app.get("/listings",  async (req, res)=>{
   let allListings = await Listing.find({})
   res.render("listings/home.ejs", {allListings});
})
//Testing route
app.get("/testListing", async (req, res)=>{
    const list1 = new Listing ({
        title: "My home",
        description: "Available for rent",
        location: "Jhansi, UttarPradesh"
    });  
   await list1.save();
   res.send("Test successful")
});
//New route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});
//Create route
app.post("/listings", async (req, res)=>{
    let newListing =  new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//show route (read)
app.get("/listings/:id",async (req, res)=>{
    let {id} = req.params;
    let specificList = await Listing.findById(id);
    res.render("listings/specificList.ejs", {specificList});
});

//update route
app.get("/listing/:id/update", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});
//Edit route
app.put("/listing/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})// just ask chatGpt 
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");

})


//-----------------------

app.listen("8080", (req, res)=>{
    console.log("Server is listening to port 8080");
});


