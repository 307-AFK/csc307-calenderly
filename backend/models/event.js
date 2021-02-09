const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  interviewers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Event', eventSchema);
