const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const connection = require('./config/database');
const cors = require("cors");
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);
// const cookieParser = require('cookie-parser');

/**
 * -------------- GENERAL SETUP ----------------
 */

require('dotenv').config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:3001",
    credentials: true
}));

// did this do anything to set cookies?
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Origin, Accept');
    next();
});

app.use(fileUpload({
    createParentPath: true
}));

/**
 * -------------- SESSION SETUP ----------------
 */

// const sessionStore = new MongoStore({ 
//     mongooseConnection: connection, 
//     collection: 'sessions' 
// });
// app.enable('trust proxy');
// app.use(session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore
// }));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
// require('./config/passport');

// app.use(passport.initialize());
// app.use(passport.session());

// // What is this for?
// app.use((req, res, next) => {
//     // console.log('session', req.session);    
//     // console.log('user', req.user); //no req.user
//     next();
// });

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(process.env.PORT || 3000);
console.log('listening....');