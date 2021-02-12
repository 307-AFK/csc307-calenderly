const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewerSchema = new mongoose.Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
   },
   availability: [Boolean],
});

const intervieweeSchema = new mongoose.Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
   },
   timeChosen: Date,
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  interviewers: [interviewerSchema],
  interviewees: [intervieweeSchema],
  startDate: Date,
  endDate: Date,
  interviewersNeeded: Number,
  availabilityIncrement: Number,
});

module.exports = mongoose.model('Event', eventSchema);
