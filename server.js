require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');

const app = express();

//MIDDLEWARE
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
//* setup the session with the following:
app.use(session({
  // * secret: A string used to "sign" the session ID cookie, which makes it unique from application to application. We'll hide this in the environment
  secret: process.env.SESSION_SECRET,
  // * resave: Save the session even if it wasn't modified. We'll set this to false
  resave: false,
  // * saveUninitialized: If a session is new, but hasn't been changed, save it. We'll set this to true.
  saveUninitialized: true
}));
// initialize the passport configuration & session as middleware BELOW your session configuration. This ensures that Passport is aware that the session module exists.
app.use(passport.initialize());
app.use(passport.session());

//FLASH
app.use(flash()); //must go after session middleware; adds a method to request object for universal access

//Set up local variables (data that's accessible from anywhere in the app)
app.use((req, res, next) => {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

// we use the middleware in the middle of our route to the profile (or any other page we want to restrict)
app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));

var server = app.listen(process.env.PORT || 3000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 3000}🎧`));

module.exports = server;
