const express = require("express");
const router = express.Router({mergeParams: true});
const user = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedin } = require("../middlewares");
const userController = require("../controllers/users");

//for signup form and to signup(post)
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

//for login form and to login(post)
router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl, //Now, what happens is that once our user is logged in, our session gets reset bc of passport's properties! so we call this new mw in which before the user is authenticated or logged in, we're saving the redirectUrl from req.session before it getting reset in res.locals to which passport doesnt have access
    passport.authenticate('local', //authenticates if the username and password exixts in db or not(we don't need to even access req.body everything is done by passport itself);
    {failureRedirect: '/login', //always remember, passport relies on session id(from express sessions here) for storing reliable info of the user for one session
    failureFlash: true
    }), //ask chatgpt 
    wrapAsync (userController.login))


//for updating the account details(email, username and password);
router.route("/account")
.get(isLoggedin, wrapAsync(userController.renderEditForm))
.post(isLoggedin, wrapAsync(userController.editAc))

//for logging out
router.get("/logout", userController.logout);



module.exports = router;