"use strict";

const express = require('express');
const moment = require('moment');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const nameTrack = require("./nameTrack");

const app = express();
const nameTracker = nameTrack();

const handlebarSetup = exphbs({
    partialsDir: "./views",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/",function(req,res){
    res.render("index",{
        name: nameTracker.name(),
        counter: nameTracker.counter()
    });
});

app.post('/greet',function(req,res){
    nameTracker.greet(req.body.inputName);
    res.redirect('/');
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});