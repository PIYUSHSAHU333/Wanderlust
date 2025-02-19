const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({ path: "../.env"})
main()
.then((res)=>{
    console.log("Mongoose connected");
    initDb();
})
.catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(process.env.ATLASDB_URL)
}



async function initDb(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "67b1acb523ce7de5af73cd5e"})); //In JavaScript, the parentheses () are necessary when returning an object in an arrow function. This is because if you directly write an object literal without parentheses, JavaScript will interpret it as a block of code, not as an object being returned
    await Listing.insertMany(initData.data);
    console.log("Data initialised")
}
