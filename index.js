"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const NameRoutes = require('./name-routes');

const nameTrack = require("./nameTrack");

const app = express();

const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/name_list';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });

  const nameTracker = nameTrack(pool);
const nameRoutes = NameRoutes(nameTracker);

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

app.get("/", nameRoutes.index);
app.post('/greet', nameRoutes.greet);
app.get("/greeted", nameRoutes.greeted);
app.post("/clear",nameRoutes.clear);
app.get("/counter/:nameChoice", nameRoutes.counter);
app.post("/return", nameRoutes.returnHome);

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("app started at port: " + PORT);
});