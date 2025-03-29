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


const notificationSchema = new schema({
    user: {
        type:schema.Types.ObjectId,
        ref:"User"
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification",notificationSchema);