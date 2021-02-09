const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const AvailabilitySchema = new mongoose.Schema({
   event: { type: Schema.Types.ObjectId, ref: 'Event'},
   availability: [Boolean],
   incrementInMins: Number,
});

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  googleId: String,
  secret: String,
  events: [AvailabilitySchema],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
