"use strict";

const express = require('express');
const moment = require('moment');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

app.get("/",function(req,res){
    res.send("Hello World!!");
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});