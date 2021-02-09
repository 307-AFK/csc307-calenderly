const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const Event = require('./models/event');
const User = require('./models/User').User;

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

app.get('/', (req, res) => {
  res.send('Hello world!');
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
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
