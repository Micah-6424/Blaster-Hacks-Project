// require packages
require("dotenv").config(); //for environnement variables
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

// listen to routes

// root route
app.get("/", (req, res) => {
    res.render("index");
});


// listen to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});