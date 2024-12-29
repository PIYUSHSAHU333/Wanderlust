const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
        },
    image: {
        type: Object,
        default: "C:\Users\piyus\majorProject\MAJORPROJECT\holly-7590229_1280.jpg",
        set: (v)=> v ===""?"C:\Users\piyus\majorProject\MAJORPROJECT\holly-7590229_1280.jpg": v
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;