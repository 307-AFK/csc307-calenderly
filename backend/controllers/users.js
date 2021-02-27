const mongoose = require('mongoose');
const User = require('../models/User');

module.exports.getUsers = async (req, res) => {
  const users = await User.find();
  if (users) {
    res.send(users);
  } else {
    res.status(404).send('Couldn\'t get users');
  }
};

module.exports.getUser = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userid)) {
    const user = await User.findById(req.params.userid);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send('User not found');
    }
  } else {
    res.status(400).send('Invalid user id');
  }
};

// TODO: when user is deleted, remove them from their events
module.exports.deleteUser = async (req, res) => {
  User.findByIdAndDelete(req.params.userid, (err) => {
    if (err) {
      res.status(404).send('Couldn\t delete user');
    } else {
      res.status(204).send('User deleted');
    }
  });
};

module.exports.getEvents = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userid)) {
    const user = await User.findById(req.params.userid);
    if (user) {
      res.send(user.events);
    } else {
      res.status(404).send('User not found');
    }
  } else {
    res.status(400).send('Invalid user id');
  }
};
