const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require('./models/User');

// Routes
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* User Auth */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
}, (accessToken, refreshToken, profile, cb) => {
  const account = {
    googleId: profile.id,
    name: profile.displayName,
  };

  if (profile.emails) account.email = profile.emails[0].value;
  if (profile.photos) account.picture = profile.photos[0].value;

  User.findOrCreate(account, (err, user) => cb(err, user));
}));

/* Auth Routes */
app.get('/auth/account', (req, res) => {
  const account = req.user ? {
    // eslint-disable-next-line no-underscore-dangle
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  } : null;

  res.json(account || {});
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => res.redirect(process.env.CLIENT_URL));

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

/* Endpoints */
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

module.exports = app;
