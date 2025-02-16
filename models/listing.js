const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./reviews");
const { string, required, number } = require("joi");
main().then((res=>{
    console.log("Mongoose connected");
}))
.catch((err) => {
    console.log(err);
})
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    price: {
         type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    image: {
        url: String, //image field automatically becomes object bc it has two keys url and filename
        filename: String

        // type: Object,
        // default: "/images/holly-7590229_1280.jpg",
        // set: (v) => (v === "" ? "/images/holly-7590229_1280.jpg" : v), //ask gpt
    },
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{ 
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Mountains", "Trending", "Castles", "Farms", "Rooms", "Pools", "Arctic", "Amazing cities", "Camping", "Domes", "Boats"],
        required: true
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{ $in: listing.review}});
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;