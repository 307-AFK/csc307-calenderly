const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const BlockSchema = new mongoose.Schema({
   start: Date,
   end: Date
});

const AvailabilitySchema = new mongoose.Schema({
   event: { type: Schema.Types.ObjectId, ref: 'Event'},
   blocks: [BlockSchema]
});

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  googleId: String,
  secret: String,
  events: [AvailabilitySchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;
