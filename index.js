const express = require("express");
const ExpressErr = require("./utils/ExpressErr.js");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { title } = require("process");
const { url } = require("inspector");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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

//Routes:-

//listing and review routes(using routers)
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//!!--Invalid route handler--!!
app.use((req, res, next)=>{
   throw new ExpressErr(401, "Page not found");
}); 
//or
// app.all("*", (req, res, next)=>{
//    throw new ExpressErr(401, "Page not found");
// })

// !!--Error Handling Middlewares--!!
app.use((err, req, res, next)=>{
   let {status = 500, message = "Some error occured" } = err;
   res.status(status).render("error.ejs", {message});
//    res.status(status).send(message);
});

//-----------------------
app.listen("8080", (req, res)=>{
    console.log("Server is listening to port 8080");
});


