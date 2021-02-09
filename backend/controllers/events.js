const mongoose = require('mongoose');
const Event = require('../models/event');

module.exports.getEvents = async (req, res) => {
  const events = await Event.find();
  if(events)
     res.send(events);
  else
     res.status(404).send("Couldn't get events");
};

module.exports.getEvent = async (req, res) => {
   if(mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      const e = await Event.findById(req.params.eventid);
      if(e)
         res.send(e);
      else
         res.status(404).send("Event not found");
   }
   else
      res.status(400).send("Invalid event id");
};

module.exports.getEventInterviewers = async (req, res) => {
   if(mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      const e = await Event.findById(req.params.eventid);
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
};
