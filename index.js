"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const nameTrack = require("./nameTrack");

const app = express();
const nameTracker = nameTrack();

app.use(session({
    secret: "secret message",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

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

app.get("/", function (req, res) {
    res.render("index", {
        name: nameTracker.name(),
        counter: nameTracker.counter(),
        greet: nameTracker.greeting()
    });
});

app.post('/greet', function (req, res) {
    if (req.body.languageChoice) {
        if ((req.body.inputName).trim()) {
            nameTracker.lang(req.body.languageChoice);
            nameTracker.greet(req.body.inputName);
            res.redirect('/');
        } else {
            req.flash("info", "Enter a name!");
            res.redirect('/');
        }
    }else {
        req.flash("info", "Select a language!");
        res.redirect('/');
    }
});

app.get("/greeted", function (req, res) {
    res.render('names', {
        nameList: nameTracker.nameList()
    });
});

app.get("/counter/:nameChoice", function (req, res) {
    let name = req.params.nameChoice;
    req.flash("amount", "Hello, " + name + " has been greeted " + nameTracker.amntFor(name) + " times");
    res.redirect("/greeted");
});

app.post("/return", function (req, res) {
    res.redirect('/');
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});