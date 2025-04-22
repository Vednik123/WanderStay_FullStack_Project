const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
})


// It will automatically add username and hashed,salted password to our schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);