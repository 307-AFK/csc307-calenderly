const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const Event = require('./models/event');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB'));

const getEvents = async () => Event.find();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/events', async (req, res) => {
  const events = await getEvents();
  res.send(events);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
