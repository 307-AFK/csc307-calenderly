const mongoose = require('mongoose');
const Event = require('../models/Event');

module.exports.getEvents = async (req, res) => {
  const events = await Event.find();
  if (events) {
    res.send(events);
  } else {
    res.status(404).send('Couldn\'t get events');
  }
};

module.exports.getEvent = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.eventid)) {
    const e = await Event.findById(req.params.eventid);
    if (e) {
      res.send(e);
    } else {
      res.status(404).send('Event not found');
    }
  } else {
    res.status(400).send('Invalid event id');
  }
};

module.exports.getEventInterviewers = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.eventid)) {
    const e = await Event.findById(req.params.eventid);
    if (e) {
      if (e.interviewers) {
        res.send(e.interviewers);
      } else {
        res.status(404).send('Coudn\'t get event interviewers');
      }
    } else {
      res.status(404).send('Couldn\'t get event');
    }
  } else {
    res.status(400).send('Invalid event id');
  }
};

module.exports.createEvent = async (req, res) => {
  const eventCreator = {
    userId: req.body.eventCreator,
  };
  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    interviewers: [eventCreator],
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    interviewersNeeded: req.body.interviewersNeeded,
    availabilityIncrement: req.body.availabilityIncrement,
  });
  newEvent.save((err) => {
    if (err) {
      res.status(404).send('Couldn\'t create event');
    } else {
      res.status(201).send(newEvent);
    }
  });
};

module.exports.deleteEvent = async (req, res) => {
  Event.findByIdAndDelete(req.params.eventid, (err) => {
    if (err) {
      res.status(404).send('Couldn\'t delete event');
    } else {
      res.status(204).send('Item deleted');
    }
  });
};
