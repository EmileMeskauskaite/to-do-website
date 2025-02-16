const mongoose = require('mongoose');

// Sukuriame užduoties modelį
const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  status: { type: String, default: "In Progress" }, // Default status
  createdDate: { type: Date, default: Date.now },
});

// Sukuriame vartotojo modelį su užduotimis kaip vidiniu masyvu
const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  country:String,
  language:String,
  password: String,
  token: String,
  tasks: [taskSchema],  // Užduotys saugomos kaip masyvas
  logins: [String],      // Visos prisijungimo datos (YYYY-MM-DD)
  lastLogin: String,     // Paskutinė prisijungimo data
  activeStatus: Boolean, // Ar vartotojas prisijungęs
});

const User = mongoose.model('User', userSchema);

module.exports = User;
