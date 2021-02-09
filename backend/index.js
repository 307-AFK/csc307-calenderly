const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();

const Event = require('./models/event');
const User = require('./models/User').User;

// Routes
const eventRoutes = require('./routes/events');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB'));

const getEvents = async () => Event.find();
const getEvent = async (id) => Event.findById(id)
const getUsers = async () => User.find();
const getUser = async (id) => User.findById(id)

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
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
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  } : null;

  res.json(account || {});
});

app.get('/events', async (req, res) => {
  const events = await getEvents();
  if(events)
     res.send(events);
  else
     res.status(404).send("Couldn't get events");
});

app.get('/events/:eventid', async (req, res) => {
   if(mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      const e = await getEvent(req.params.eventid);
      if(e)
         res.send(e);
      else
         res.status(404).send("Event not found");
   }
   else
      res.status(400).send("Invalid event id");
});

app.get('/events/:eventid/interviewers', async (req, res) => {
   if(mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      const e = await getEvent(req.params.eventid);
      if(e)
         if(e.interviewers)
            res.send(e.interviewers);
         else
            res.status(404).send("Coudn't get event interviewers");
      else
         res.status(404).send("Couldn't get event");
   }
   else
      res.status(400).send("Invalid event id");
});

app.get('/users', async (req, res) => {
   const users = await getUsers();
   if(users)
      res.send(users);
   else
      res.status(404).send("Couldn't get users");
});

app.get('/users/:userid', async (req, res) => {
   if(mongoose.Types.ObjectId.isValid(req.params.userid)) {
      const user = await getUser(req.params.userid);
      if(user)
         res.send(user);
      else
         res.status(404).send("User not found");
   }
   else
      res.status(400).send("Invalid user id");

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

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
