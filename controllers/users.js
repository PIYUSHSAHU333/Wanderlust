const user = require("../models/users");


module.exports.renderSignupForm = (req, res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req, res)=>{

    try{
        let {username, email, password} = req.body;
    let newUser = new user({
        email: email,
        username: username
    });
    let registeredUser =  await user.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err)=>{ //directly logs in the user after signing up
        if(err){
        req.flash("error", "Something went wrong!");
         return res.redirect("/signup");
        }
        req.flash("success", "Welcome to wanderlust!")
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("error", e.message); //we here, also put try and catch because, if there's a error so with asyncWrap we'll be on some lost page but with try and catch we'll be as here programmed be redirected to same page with flash message be seen on same page, most probable error can be that username already exists
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("./users/login.ejs");
}

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust:)");
    let redirectUrl = res.locals.redirectUrl || ("/listings"); //if we directly log in (like without trying to add new or edit any listing) then isLoggedin will not be triggered so redirecturl will be undefinedso- or || ("/listings")
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{ //deserializes all info
        if(err){
            return next(err);
        }else{
            req.flash("success", "You have been logged out!");
            res.redirect("/listings");
        }
    });
}