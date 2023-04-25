const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  lowercaseUsername: String,
  passwordHash: String,
  joined: Number,
  description: String,
});

UserSchema.methods.getPublicPart = function () {
  const { username, joined, description } = this;
  return { username, joined, description };
};

const TweetSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Number,
  deleted: { type: Boolean, default: false },
});

TweetSchema.methods.getPublicPart = function () {
  const { _id: id, username, message, timestamp } = this;
  return { id, username, message, timestamp }
};

const User = mongoose.model('User', UserSchema);
const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = { User, Tweet };
