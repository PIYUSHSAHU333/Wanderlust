const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("Mongoose connected");
})
.catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust")
}

initDb();

async function initDb(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "679b44177d846a905b26118e"})); //In JavaScript, the parentheses () are necessary when returning an object in an arrow function. This is because if you directly write an object literal without parentheses, JavaScript will interpret it as a block of code, not as an object being returned
    await Listing.insertMany(initData.data);
    console.log("Data initialised")
}
