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

module.exports.createEvent = async (req, res) => {
  const eventCreator = {
    userId: mongoose.Types.ObjectId(req.body.eventCreator),
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
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send('No user exists with this email address');
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.eventid)) {
    res.status(400).send('Invalid event id');
  }

  Event.updateOne(
    { _id: req.params.eventid, 'interviewers.userId': { $ne: user._id } },
    { $push: { interviewers: { userId: user._id } } },
  ).then((updated) => {
    if (!updated) {
      res.status(404).send('Couldn\'t update event');
    }
    // add event to list in user (if not already added)
    User.updateOne(
      { _id: user._id, 'events.eventId': { $ne: req.params.eventid } },
      { $push: { events: { eventId: req.params.eventid, role: 'interviewer' } } },
    ).then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).send('Couldn\'t update user');
      }
      Event.findById(req.params.eventid)
        .then((updatedEvent) => res.status(200)
          .send({ message: `${updated.n} user(s) added successfully`, event: updatedEvent }));
    });
  });
};

module.exports.addInterviewee = async (req, res) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send('No user exists with this email address');
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.eventid)) {
    res.status(400).send('Invalid event id');
  }

  Event.updateOne(
    { _id: req.params.eventid, 'interviewees.userId': { $ne: user._id } },
    { $push: { interviewees: { userId: user._id } } },
  ).then((updated) => {
    if (!updated) {
      res.status(404).send('Couldn\'t update event');
    }
    // add event to list in user (if not already added)
    User.updateOne(
      { _id: user._id, 'events.eventId': { $ne: req.params.eventid } },
      { $push: { events: { eventId: req.params.eventid, role: 'interviewee' } } },
    ).then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).send('Couldn\'t update user');
      }
      Event.findById(req.params.eventid)
        .then((updatedEvent) => res.status(200)
          .send({ message: `${updated.n} user(s) added successfully`, event: updatedEvent }));
    });
  });
};
