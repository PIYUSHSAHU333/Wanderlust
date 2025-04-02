if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
// console.log(process.env.CLOUD_NAME); //cloud_name is a key in our .env file which can be only accesed with the help of 'dotenv' package


const express = require("express");
const ExpressErr = require("./utils/ExpressErr.js");
const priceCal = require("./utils/priceCal.js")
const app = express();
const http = require("http"); //requiring http module
const {Server} = require("socket.io"); //requiring our Socket.io
const server = http.createServer(app); //wrapping our previous http server with new server that can also handle websocket
const io = new Server(server) //finally creating new server(websocket)
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const { title } = require("process");
const { url } = require("inspector");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const user = require("./models/users.js");
const dbUrl = process.env.ATLASDB_URL;
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Listing = require("./models/listing.js");
const User = require("./models/users.js");
const { error } = require("console");
const { date } = require("joi");
const { Socket } = require("dgram");
const Notification = require("./models/notification.js");
const Message = require("./models/messages.js");
const ChatRoom = require("./models/chatRoom.js");
const {isLoggedin} = require("./middlewares.js")
const sendNotification = require("./utils/notifiation.js");
let store = MongoStore.create( //some imp options for connect-mongo
    {
        mongoUrl: dbUrl, //link toactual db (actually connect-mongo allows exp-sessions to store session info in Atlas and not in local memory | it's a via)
        crypto: {
            secret: process.env.SECRETSTORE
          },
        touchAfter: 24 * 3600 //helps session not to get update on every request (like just clicking on link to have access to fb)-not related to login/logout or something
    }
)

store.on("error", ()=>{
    console.log("ERROR IN MONGOOSE SESSION STORE", err);
})

const sessionOption = {
    store, //telling our express session to use connect-mongo for storing session info and local device
    secret: process.env.SECRET,
    saveUninitialized: false, //makes a session, even if user didnt login if set to true
    resave: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //In milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
const sessionMiddleware = session(sessionOption);
//attaching session with webscoket(socket.io)as socket.io doesnt send cookies so attaching session will let still socket.io to access session info 
io.use((Socket, next)=>{
    sessionMiddleware(Socket.request, {}, next)
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//important: initializes our passport tool
app.use(passport.session());//important: passport.session() stores user login information in the session, so they don’t have to log in again on every req in one session.
//(ask ChatGpt: "Explain in simpler terms") ps: for my own future understanding:) ;
passport.use(new LocalStrategy(user.authenticate()));// This authenticate which is a static method under passport-local-mongoose will check if our user has a correct password and usename, This is a method for localstrategy only.

passport.serializeUser(user.serializeUser()); //stores info for a user in one session(serialising the user)
passport.deserializeUser(user.deserializeUser()); //removes the info of user when session ends(deserialising user);





io.use((socket, next) => {
    // console.log("Session Data:", socket.request.session);
    if (socket.request.session && socket.request.session.passport.user) {
        console.log(socket.request.session.passport.user)
      next(); // Allow connection
    } else {
      next(new Error("Unauthorized")); // Reject connection
    }
  });
  

//socet.io connection establishment
io.on("connection",  (socket)=>{
    console.log("A new user has been connected",socket.id)
    socket.emit("welcome", `Welcome to the server ${socket.id}`)

     socket.on("joinRoom", async ({roomId})=>{
        socket.join(roomId)
        console.log(`User joined a room: ${roomId}`);
        
    });

    socket.on("sendMsg",async(data)=>{
        console.log("data from sendMsg:",data);
        const {roomId, sender,content} = data
        const chatRoom = await ChatRoom.findOne({roomId: data.roomId});
        const {UserAId, userBId} = chatRoom;

        let receiver = userBId === data.sender ? UserAId : userBId

        const message = new Message({
            roomId,
            sender,
            receiver,
            content
        })
        console.log("message: ",message)
        await message.save() 
        io.to(roomId).emit("new-msg", message)
    })


    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


//initailizing razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})
app.use((req, res, next)=>{
    res.locals.success = req.flash("success"); //we can access res.locals.success in ejs tempelate now 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //don't be confused, In an Express app, req.user is typically assigned by Passport.js, which is a middleware for authentication. Now we can access currUser in ejs temeplates as well unlike req object(as it's not accessible for ejs tempelates)
    // console.log(res.locals.currUser)
    next();
});
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const bookingRouter = require("./routes/booking.js");
const chatRouter = require("./routes/chats.js");

//-----------------------------------------
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true})); //parses url encoded data from form to js objects in req.body
app.use(express.json()); //helps in having json format data into req.body!
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
    await mongoose.connect(process.env.ATLASDB_URL); 
}

//----------------------------------------

//Routes:-

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new user({
//         email: "abeltesafaye@hut.in",
//         username: "The Weeknd" //passport-local-mongoose will automatically create this field in userSchema & for passwords well
//     });
//     let registeredUser = await user.register(fakeUser, "hurryuptomorrow"); //saves new user with salting and hashed password in mongoose (yes sir you heard it right, no need of user.save() and all shit)
//     res.send(registeredUser);
// });
//listing,review,users and booking routes(using routers)

//-----------------------------------------
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/:id/booking", bookingRouter);
app.use("/chats", chatRouter)
//caluclate price in livetime route
app.use("/calculateprice",( req, res)=>{
   const {checkIn, checkOut, pricePerNight} = req.body;

   if(!checkIn || !checkOut){
      return res.status(400).json({error: "Invalid date"});
   }
        const totalPrice = priceCal(checkIn, checkOut, pricePerNight);
        res.json({totalPrice});
        
})
//create order (order id for razor pay)api
app.post("/create-order",async (req, res)=>{
    try{
        const {amount} = req.body;

        const options = {
            amount: amount * 100, //razorpay works with paisa,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    }catch(error){
        res.status(500).json({message: "Error creating order", error})
    }
});

//verifying the payement after the payment has been processed by razorpay
app.post("/verify", async (req, res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body; // we receives from res from handler function which is given by razorpay backend

    const body = razorpay_order_id + "|" + razorpay_payment_id; //creating the body with same logic as razorpay

    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET) //razorpay algo also uses secretkey to create hashed signature so we're also using same logic
    .update(body) //hashing the body with same algo and logic to make same signature
    .digest("hex");

    if (expectedSignature === razorpay_signature) { //if both signature matches then payment verifed
        res.json({success: "Payment successful"}); // Render success page
      } else {
        res.json({failure: "Payment failed"}); // Render failure page
      }
      console.log("Payment verified")
});

//=>>>route for wishlist
app.post("/wishlist/:listingId", isLoggedin, async(req, res)=>{
    const {listingId} = req.params
    const listing = await Listing.findById(listingId);
    const user = await User.findById(res.locals.currUser._id);

    if(!user){
        return res.status(401).json({message: "Unauthorized: User not found", redirect: "/login"})
    }

    if(!listing){
        return res.status(404).json({message: "Listing not found"})
    }

    if(!user.wishlist.includes(listingId)){
        user.wishlist.push(listing);
        await user.save();
        await sendNotification(res.locals.currUser._id, "A new listing has been added to wishlist");
    }
    console.log("Wishlist updated??")
})

app.delete("/wishlist/:listingId", isLoggedin, async(req, res)=>{
    const {listingId} = req.params
    const listing = await Listing.findById(listingId);
    const user = await User.findById(res.locals.currUser._id);

    if(!user){
        return res.status(401).json({message: "Unauthorized: User not found"})
    }

    if(!listing){
        return res.status(404).json({message: "Listing not found"})
    }
    if(user.wishlist.includes(listingId)){
        user.wishlist = user.wishlist.filter(id => id.toString() !== listingId);
        await user.save();
        await sendNotification(res.locals.currUser._id, "A listing has been removed from wishlist");
    }
    console.log("Wishlist item deleted");

})
//Notification route
app.get("/notification",isLoggedin,async (req, res)=>{
    const notifications = await Notification.find({user: res.locals.currUser._id}).sort({createdAt: -1});
    res.render("users/notification.ejs", {notifications});
    await Notification.updateMany({user: res.locals.currUser._id, isRead: false}, {isRead: true});
} );
//notifoication count
app.get("/notification/count", async (req, res)=>{
    let count;
    if(!res.locals.currUser){
        count = 0;
    }else{
         count = await Notification.countDocuments({user: res.locals.currUser._id, isRead: false});
    }
    
    res.json({count: count});
});

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
server.listen("8080", (req, res)=>{
    console.log("Server is listening to port 8080");
});


