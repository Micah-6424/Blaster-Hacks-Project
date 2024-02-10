// require packages
require("dotenv").config(); //for environnement variables
const express = require("express");
const app = express();
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

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

// setup firebase for database

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN + ".firebaseapp.com",
  projectId: process.env.FIREBASE_AUTH_DOMAIN + "",
  storageBucket: process.env.FIREBASE_AUTH_DOMAIN + ".appspot.com",
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
// listen to routes

// root route

// login route
app.get("/login", (req, res) => {
    res.render("login", {a:"from server"});
});

// signup route
app.get("/signup", (req, res) => {

});


// listen to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});