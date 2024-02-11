// require packages
require("dotenv").config(); //for environnement variables
const mongoose = require('mongoose'); // mongodb database connection
const sanitize = require('mongo-sanitize'); //cleans user data in case of malicious input
const session = require("express-session");
require("passport-local-mongoose");
const passport = require("passport"); //for authentication
const express = require("express");
const app = express();

// setup express instance
const port = process.env.port || 9000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({
    type: 'application/json'
}))
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// setup mongoDB
var {
    User,
    Post
} = require("./modules/models.js");

// setup passport 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect to mongoDB
mongoose.connect("mongodb+srv://miga3627:"+ process.env.mongoPassword + "@realorcake.2lruhk3.mongodb.net/?retryWrites=true&w=majority");




// listen to routes

// root route
app.get("/", (req,res) => {
    res.render("home");
})
// login route

// signup route
app.route("/signup")
.get((req, res) => {
    res.render("signup");
}).post(async (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/home");
    }

    // get data from request
    let {name,username,password,email} = req.body

    // create user with mongo and using passport to hash password
    let models;
    try {
        models = await User.find({email:email});
    } catch(e) {
        console.log(e);
    }
    console.log(models);

        if (models.length == 0) { //new user
            User.register({
                "name":name,
                "username":username,
                "email":email
            }, password, function (err, user) {
                console.log("user registered");
                if (err) {
                    console.log(err);
                    res.redirect("register err");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        console.log(req.isAuthenticated())
                        console.log("authenticated");
                        res.redirect("/secret");
                    });
                }
            });
        } else { //a user is already registered with that email
            console.log("user already registered");
        }
});


app.get("/login", (req,res) => {
        res.render("login");
    }).post(async (req, res) => {
        if(req.isAuthenticated()){
            res.redirect("/home");
        }
});

app.get("/secret", (req,res) =>  {
    console.log(req.isAuthenticated())
    if(!req.isAuthenticated()){
        res.send("You are not authenticated");
    }

    // get the current user info
    res.send(req.user.toString());
})


// listen to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});