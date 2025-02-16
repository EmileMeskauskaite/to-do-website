var express = require('express');
var router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  db.all(`SELECT * FROM todolist`, [], function(err, rows) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


router.get('/to-do-page/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.tasks || []);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch to-do items' });
  }
});


router.post("/create_todo", async (req, res) => {
  try {
    const { userId, task, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.tasks) {
      user.tasks = [];
    }

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    const newTask = {
      task,
      description,
      status: status || "In Progress",
      createdDate: formattedDate, 
    };

    user.tasks.push(newTask);
    await user.save();

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { username, password, email, fullname, country, language } = req.body;
    
    const user = new User({ username, password, email, fullname, country, language, tasks: [] });

    await user.save();

    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const today = new Date().toISOString().split('T')[0];

    if (!user.logins) {
      user.logins = [];
    }

    user.activeStatus = true;
    user.lastLogin = today;
    user.logins.push(today);

    await user.save();

    res.json({
      message: 'Login successful',
      user: { 
        _id: user._id, 
        username: user.username, 
        activeStatus: user.activeStatus, 
        lastLogin: user.lastLogin,
        logins: user.logins 
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { activeStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.activeStatus = activeStatus;
    await user.save();

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

router.delete('/delete_task/:userId/:taskId', async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const taskIndex = user.tasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    user.tasks.splice(taskIndex, 1);
    await user.save();

    res.json({ tasks: user.tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

router.put("/update_task_status/:userId/:taskId", async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const task = user.tasks.find(t => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = status;
    await user.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task status" });
  }
});

module.exports = router;
