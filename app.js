// require packages
require("dotenv").config(); //for environnement variables
const mongoose = require('mongoose'); // mongodb database connection
const sanitize = require('mongo-sanitize'); //cleans user data in case of malicious input
const session = require("express-session");
require("passport-local-mongoose");
const passport = require("passport"); //for authentication
const express = require("express");
const app = express();
let fs = require('fs');
let path = require('path');

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
// when user tries to logout
app.post("/logout", (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
      return;
});
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
        models = await User.find({username:username});
    } catch(e) {
        console.log(e);
    }
    console.log(models);

        if (models.length == 0) { //new user
            User.register({
                "name":sanitize(name),
                "username":sanitize(username),
                "email":sanitize(email.toLowerCase())
            }, sanitize(password), function (err, user) {
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
            username: username,
            password: password
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

app.route("/help")
.get((req,res) => {
    if(!req.isAuthenticated()){
        res.redirect("/");
        return;
    }


    // read tags.txt and split by comma into an array
    let tags = fs.readFileSync(path.join(__dirname, 'tags.txt'), 'utf8').split(",");
    res.render("help", {tags: tags});
})
.post(async (req,res) => {
    if(!req.isAuthenticated()){
        res.redirect("/");
        return;
    }
    let {title,description,asking_price,tag} = req.body;
    console.log(asking_price);
    asking_price = parseInt(asking_price);
    console.log(asking_price);

    if(!(asking_price != 5 || asking_price != 10 || asking_price != 20)) {
        res.status(404).send("Invalid asking price");
        return;
    }

    if(title.length <10){
        res.status(404).send("Invalid title");
        return;
    }

    if(title.length > 50){
        res.status(404).send("Invalid title");
        return;
    }

    let tags = fs.readFileSync(path.join(__dirname, 'tags.txt'), 'utf8').split(",");

    if(!tags.includes(tag)){
        res.status(404).send("Invalid tag");
        return;
    }

    if(description.length < 30){
        res.status(404).send("Invalid description");
        return;
    }

    if(description.length > 500){
        res.status(404).send("Invalid description");
        return;
    }

    let post = new Post({
        title: sanitize(title),
        content: sanitize(description),
        moneyNeeded: sanitize(asking_price),
        moneyCollected: 0,
        tag: tag,
        username: req.user.username,
        user: req.user
    });

    try {
        await post.save();
        let user;
        try {
            user = await User.findById(req.user._id);
            console.log("was a user found???");
            console.log(user);
        } catch(e) {
            console.log(e);
            res.status(404).send("Error creating help request in user");
            return;
        }
        user.posts.push(post);
        try {
            await user.save();
        } catch(e) {
            console.log(e);
            res.status(404).send("Error creating help request in user");
            return;
        }
        res.status(200).send("Post created");
        return;
    } catch(e) {
        console.log(e);
        res.status(404).send("Error creating help request");
        return;
    }
});


app.route("/feed")
.get(async (req,res) => {
    if(!req.isAuthenticated()){
        res.redirect("/");
        return;
    }


    let posts;
    try {
        posts = await Post.find({});
    } catch(e) {
        console.log(e);
        res.status(404).send("Error getting posts");
        return;
    }

    // sort posts by new Date (newest first)
    posts.sort((a,b) => {
        return b.time - a.time;
    });

    let {name,username,email} = req.user;
    res.render("feed.ejs", {posts: posts, name,username,email});
});


app.route("/post/:id")
.get(async (req,res) => {
    if(!req.isAuthenticated()){
        res.redirect("/");
        return;
    }

    let post;
    try {
        post = await Post.findById(req.params.id);
    } catch(e) {
        console.log(e);
        res.redirect("/feed");
        return;
    }

    let {name,username,email} = req.user;
    res.render("post.ejs", {post: post, name,username,email});
});


// listen to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});