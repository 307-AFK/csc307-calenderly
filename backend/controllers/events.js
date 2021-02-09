const Event = require('../models/event');

module.exports.getEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};
