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

const reviewSchema = new schema({
    Comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Review", reviewSchema);