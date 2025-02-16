const mongoose = require('mongoose');

// Sukuriame užduoties modelį
const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  status: String,
});

// Sukuriame vartotojo modelį su užduotimis kaip vidiniu masyvu
const userSchema = new mongoose.Schema({
  full_name: String,
  username: String,
  email: String,
  password: String,
  token: String,
  tasks: [taskSchema],  // Užduotys saugomos kaip masyvas
  lastlogin: String,
  activestatus: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
