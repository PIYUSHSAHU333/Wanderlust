
const mongoose = require("mongoose");
const schema = mongoose.Schema;

main().then((res=>{
    console.log("Mongoose connected");
}))
.catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

const bookingSchema = new schema({
    name: {
        type: String,
        require
    },
    user: {
        type:schema.Types.ObjectId,
        ref: "User"
    },
    number: {
        type: Number,
        
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date 
    },
    phoneNum: {
        type: Number
    },
    email: {
        type: String
    },
    Listing: {
        type:schema.Types.ObjectId,
        ref: "listing"
    },
    specialReq: {
        type: String
    }
    ,
    isPayment: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("Booking", bookingSchema);