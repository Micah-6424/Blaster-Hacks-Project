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
    if(req.user == undefined) { //not logged in
        res.render("home", {logged_in: false});
        return;
    } else {
        let {name,username,email} = req.user;
        res.render("home",{logged_in: true,name,username,email});
        return;
    }
    
})
// login route

// signup route
app.route("/signup")
.get((req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/");
        return;
    }
    res.render("signup");
}).post(async (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("/");
        return;
    }

    // get data from request
    let {name,username,password,email} = req.body
    console.log("the email::" + email);

    // create user with mongo and using passport to hash password
    let models;
    try {
        models = await User.find({username:username.toLowerCase()});
    } catch(e) {
        console.log(e);
    }
    console.log(models);

        if (models.length == 0) { //new user
            User.register({
                "name":sanitize(name),
                "username":sanitize(username.toLowerCase()),
                "email":sanitize(email.toLowerCase())
            }, sanitize(password.toLowerCase()), function (err, user) {
                console.log("user registered");
                if (err) {
                    console.log(err);
                    res.status.send(404).send("Error registering user");
                    return;
                } else {
                    passport.authenticate("local")(req, res, function () {
                        console.log(req.isAuthenticated())
                        console.log("authenticated");
                        res.status(200).send("User registered");
                        return;
                    });
                }
            });
        } else { //a user is already registered with that email
            console.log("user already registered");
        }
});


app.route("/login").get((req,res) => {
        if(req.isAuthenticated()){
            res.redirect("/");
            return;
        }
        res.render("login");
    }).post(async (req, res) => {
        if(req.isAuthenticated()){
            res.redirect("/");
            return;
        }
        // get data from request
        let {username,password} = req.body;
        // authenticate user
        const user = new User({
            username: username.toLowerCase(),
            password: password.toLowerCase()
        });


        req.login(user, function (err) {
            if (err) {
                console.log(err);
                res.redirect("/login");
                return;
            } else {
                passport.authenticate("local")(req, res, function () {
                    console.log(req.isAuthenticated())
                    console.log("authenticated");
                    res.redirect("/");
                    return;
                });
            }
        });

       
});

app.get("/secret", (req,res) =>  {
    console.log(req.isAuthenticated())
    if(!req.isAuthenticated()){
        res.send("You are not authenticated");
        return;
    }

    // get the current user info
    res.send(req.user.toString());
})


// listen to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});