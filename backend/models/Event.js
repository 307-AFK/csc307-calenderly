const mongoose = require('mongoose');

const { Schema } = mongoose;

const interviewerSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  availability: [{
    date: Date,
    times: [Boolean],
  }],
});

const intervieweeSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timeChosen: Date,
  interviewers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  interviewers: [interviewerSchema],
  interviewees: [intervieweeSchema],
  startDate: Date,
  endDate: Date,
  interviewersNeeded: { type: Number, default: 1 },
  availabilityIncrement: { type: Number, default: 60 },
});

module.exports = mongoose.model('Event', eventSchema);
