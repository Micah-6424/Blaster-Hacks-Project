// Requiring module
const mongoose = require('mongoose');
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");

// Create User Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    
});

// create Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    img: String,
    moneyNeeded: Number,
    moneyCollected: Number,
    tag: String,
    time: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
});

// add passport-local-mongoose to userSchema
userSchema.plugin(passportLocalMongoose);

// Create User model
const User = new mongoose.model("User", userSchema);
const Post = new mongoose.model("Post", postSchema);

module.exports = {User,Post};