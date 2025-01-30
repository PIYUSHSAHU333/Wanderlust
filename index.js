const express = require("express");
const ExpressErr = require("./utils/ExpressErr.js");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { title } = require("process");
const { url } = require("inspector");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const user = require("./models/users.js");
const sessionOption = {
    secret: "evictionno.4",
    saveUninitialized: true,
    resave: false,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000, //In milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//important: initializes our passport tool
app.use(passport.session());//important: passport.session() stores user login information in the session, so they don’t have to log in again on every req in one session.
//(ask ChatGpt: "Explain in simpler terms") ps: for my own future understanding:) ;
passport.use(new LocalStrategy(user.authenticate()));// This authenticate which is a static method under passport-local-mongoose will check if our user has a correct password and usename, This is a method for localstrategy only.

passport.serializeUser(user.serializeUser()); //stores info for a user in one session(serialising the user)
passport.deserializeUser(user.deserializeUser()); //removes the info of user when session ends(deserialising user);

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
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

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new user({
//         email: "abeltesafaye@hut.in",
//         username: "The Weeknd" //passport-local-mongoose will automatically create this field in userSchema & for passwords well
//     });
//     let registeredUser = await user.register(fakeUser, "hurryuptomorrow"); //saves new user with salting and hashed password in mongoose (yes sir you heard it right, no need of user.save() and all shit)
//     res.send(registeredUser);
// });

//listing and review routes(using routers)
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

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


