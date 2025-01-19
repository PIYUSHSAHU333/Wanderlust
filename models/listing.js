const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./reviews");
main().then((res=>{
    console.log("Mongoose connected");
}))
.catch((err) => {
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const listingSchema = new schema({
    title: {
        type: String,
        require: true
    }, 
    description: {
        type: String,
        require: true
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
        type: Object,
        default: "/images/holly-7590229_1280.jpg",
        set: (v) => (v === "" ? "/images/holly-7590229_1280.jpg" : v), //ask gpt

    },
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{ $in: listing.review}});
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;