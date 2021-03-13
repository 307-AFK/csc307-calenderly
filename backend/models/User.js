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
  events: [{ eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, role: String }],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
