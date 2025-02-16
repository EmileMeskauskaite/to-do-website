var express = require('express');
var router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
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

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Paverskite userId į MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(userId); // Pakeistas 'new' operatorius

    // Paimame vartotoją pagal userId
    const user = await User.findOne({ _id: objectId });

    // Jei vartotojas nerastas
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Grąžinkite užduotis, kurios yra vartotojo dokumente
    res.json(user.tasks);  // Užduotys yra tiesiogiai vartotojo dokumente
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch to-do items' });
  }
});

router.post('/create_todo', async (req, res) => {
  try {
    const { userId, task, description, status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Sukurkite užduotį
    const newTask = {
      task,
      description,
      status
    };

    // Pridėkite užduotį į vartotojo tasks masyvą
    user.tasks.push(newTask);

    await user.save();  // Išsaugokite vartotojo dokumentą su nauja užduotimi
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { username, password,email, fullname } = req.body;
    
    // Sukuriame vartotoją su paprastu slaptažodžiu
    const user = new User({ username, password, email, fullname });

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

    // Ieškome vartotojo pagal username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Patikriname, ar slaptažodis atitinka
    if (password === user.password) {
      res.json({
        message: 'Login successful',
        user: { _id: user._id, username: user.username }
      });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});




router.delete('/delete_task/:id', async (req, res, next) => {
  const taskId = req.params.id;
  
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // Find the user whose task needs to be deleted (assuming the task is part of the user's "tasks" array)
    const user = await User.findOne({ 'tasks._id': taskId });

    if (!user) {
      return res.status(404).json({ error: 'User or task not found' });
    }

    // Remove the task from the user's tasks array
    user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);

    // Save the updated user document
    await user.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});



module.exports = router;