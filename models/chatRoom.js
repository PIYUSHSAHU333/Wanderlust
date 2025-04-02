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

const chatRoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    userAId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userBId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
   { timestamps: true });

  
module.exports = mongoose.model('ChatRoom', chatRoomSchema);