const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const {isLoggedin} = require("../middlewares.js");
const Listing = require("../models/listing.js");
const { route } = require("./listings.js");

router.get("/:listingid", asyncWrap(async(req, res)=>{
    const {listingid} = req.params;
    const userId = res.locals.currUser._id;

    const listing = await Listing.findById(listingid).populate("owner")
}));

module.exports = router;