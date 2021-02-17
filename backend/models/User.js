const mongoose = require('mongoose');

const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  googleId: String,
  secret: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
