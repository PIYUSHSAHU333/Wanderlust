const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

main()
.then(res=>{
    console.log("Mongoose connected")
})
.catch(error=>{
    console.log(error)
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL)
}

const messageSchema = new schema({
    sender: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    listing: {
        type: schema.Types.ObjectId,
        ref: "listing"
    },
    seen: {
        type: Boolean,
        default: false
    },  
},
  {timestamps: true}

)
module.exports = mongoose.model("Message", messageSchema)