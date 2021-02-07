const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()

const Event = require('./models/event')

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('Connected to MongoDB'))

const getEvents = async () => {
  return await Event.find()
}

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/events', async (req, res) => {
   events = await getEvents()
   res.send(events)
})

app.listen(3001)
