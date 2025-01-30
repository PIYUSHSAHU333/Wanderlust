const express = require("express");
const router = express.Router({mergeParams: true});
const user = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup",(req, res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync( async(req, res)=>{

    try{
        let {username, email, password} = req.body;
    let newUser = new user({
        email: email,
        username: username
    });
    let registeredUser =  await user.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to wanderlust!")
    res.redirect("/listings")
    }catch(e){
        req.flash("error", e.message); //we here, also put try and catch because, if there's a error so with asyncWrap we'll be on some lost page but with try and catch we'll be as here programmed be redirected to same page with flash message be seen on same page, most probable error can be that username already exists
        res.redirect("/signup");
    }
    
}));

router.get("/login", (req, res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",
   passport.authenticate('local', //authenticates if the username and password exixts in db or not(we don't need to even access req.body everything is done by passport itself);
    {failureRedirect: '/login', //always remember, passport relies on session id(from express sessions here) for storing reliable info of the user for one session
    failureFlash: true
    }), //ask chatgpt 
     wrapAsync (async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust:)");
    res.redirect("/listings");
}));



module.exports = router;