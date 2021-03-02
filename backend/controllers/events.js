const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');

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

const availabilityArray = (startDate, endDate) => {
  const aval = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  const times = new Array(8);
  times.fill(false);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    aval.push({ date: new Date(d), times });
  }

  return aval;
};

module.exports.createEvent = async (req, res) => {
  const avail = availabilityArray(req.body.startDate, req.body.endDate);
  const eventCreator = {
    userId: mongoose.Types.ObjectId(req.body.eventCreator),
    availability: avail,
  };

  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    interviewers: [eventCreator],
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  // save event
  newEvent.save().then((event) => {
    if (event) {
      // add this event to the creator's list of events
      User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.eventCreator) },
        { $push: { events: { eventId: newEvent._id, role: 'interviewer' } } },
      ).then((user) => {
        if (user) {
          res.status(201).send(event);
        } else {
          res.status(404).send('Created event, but couldn\'t update user');
        }
      });
    } else {
      res.status(404).send('Couldn\'t create event');
    }
  });
};

module.exports.deleteEvent = async (req, res) => {
  // delete the event
  Event.findByIdAndDelete(req.params.eventid).then((deletedEvent) => {
    if (deletedEvent) {
      // delete all references to the event in User collection
      User.updateMany(
        { events: { eventId: req.params.eventid } },
        { $pull: { events: { eventId: req.params.eventid } } },
      ).then(() => {
        res.status(204).send('Event deleted');
      });
    } else {
      res.status(404).send('Couldn\'t delete event');
    }
  });
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

module.exports.getEventInterviewees = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.eventid)) {
    const e = await Event.findById(req.params.eventid);
    if (e) {
      if (e.interviewees) {
        res.send(e.interviewees);
      } else {
        res.status(404).send('Coudn\'t get event interviewees');
      }
    } else {
      res.status(404).send('Couldn\'t get event');
    }
  } else {
    res.status(400).send('Invalid event id');
  }
};

module.exports.addInterviewer = async (req, res) => {
  const validEventId = mongoose.Types.ObjectId.isValid(req.params.eventid);
  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  if (validEventId && validUserId) {
    // add interviewer to list in event (if not already added)
    Event.updateOne(
      { _id: req.params.eventid, 'interviewers.userId': { $ne: req.body.userId } },
      { $push: { interviewers: { userId: req.body.userId } } },
    ).then((updatedEvent) => {
      if (!updatedEvent) {
        res.status(404).send('Couldn\'t update event');
      }
      // add event to list in user (if not already added)
      User.updateOne(
        { _id: req.body.userId },
        { $addToSet: { events: { eventId: req.params.eventid, role: 'interviewer' } } },
      ).then((updatedUser) => {
        if (!updatedUser) {
          res.status(404).send('Couldn\'t update user');
        }
        res.status(200).send(`${updatedEvent.n} user(s) added successfully`);
      });
    });
  } else if (validUserId) {
    res.status(400).send('Invalid event id');
  } else if (validEventId) {
    res.status(400).send('Invalid user id');
  } else {
    res.status(400).send('Invalid event and user ids');
  }
};

module.exports.addInterviewee = async (req, res) => {
  const validEventId = mongoose.Types.ObjectId.isValid(req.params.eventid);
  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  if (validEventId && validUserId) {
    // add interviewee to list in event (if not already added)
    Event.updateOne(
      { _id: req.params.eventid, 'interviewees.userId': { $ne: req.body.userId } },
      { $push: { interviewees: { userId: req.body.userId } } },
    ).then((updatedEvent) => {
      if (!updatedEvent) {
        res.status(404).send('Couldn\'t update event');
      }
      // add event to list in user (if not already added)
      User.updateOne(
        { _id: req.body.userId },
        { $addToSet: { events: { eventId: req.params.eventid, role: 'interviewee' } } },
      ).then((updatedUser) => {
        if (!updatedUser) {
          res.status(404).send('Couldn\'t update user');
        }
        res.status(200).send(`${updatedEvent.n} user(s) added successfully`);
      });
    });
  } else if (validUserId) {
    res.status(400).send('Invalid event id');
  } else if (validEventId) {
    res.status(400).send('Invalid user id');
  } else {
    res.status(400).send('Invalid event and user ids');
  }
};
