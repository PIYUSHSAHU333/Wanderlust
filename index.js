const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { title } = require("process");
const listing = require("./models/listing");
//-----------------------------------------
app.set("Views", path.join(__dirname, "Views"));
app.set("Views engine", "ejs");
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
//show route
app.get("/listings/:id",async (req, res)=>{
    let {id} = req.params;
    let specificList = await Listing.findById(id);
    res.render("listings/specificList.ejs", {specificList});
})





//-----------------------


app.listen("8080", (req, res)=>{
    console.log("Server is listening to port 8080");
})


