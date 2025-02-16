const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  status: String,
});

const userSchema = new mongoose.Schema({
  user_id: Number,
  full_name: String,
  username: String,
  email: String,
  password: String,
  token: String,
  tasks: [taskSchema],
  lastlogin: String,
  activestatus: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;