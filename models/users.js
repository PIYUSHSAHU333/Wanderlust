const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new schema({
    email:{
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose); //We're using this because this plugin will automatically add hashed and salted password and username field in our UserSchmea, We specifically use this plugin while doing authentication or as we say for in userSchema(refer chatGpt or passprt local-mongoose docs);

module.exports = new mongoose.model("User", userSchema);