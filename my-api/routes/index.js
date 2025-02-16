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
    const { username, password,email, fullname, country } = req.body;
    
    // Sukuriame vartotoją su paprastu slaptažodžiu
    const user = new User({ username, password, email, fullname, country });

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
      const today = new Date().toISOString().split('T')[0]; // Tik YYYY-MM-DD

      // Atnaujiname aktyvumo statusą, `lastLogin` ir pridedame naują login datą į masyvą
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
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { activeStatus } = req.body;

    // Ieškome vartotojo pagal userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Atnaujiname activeStatus į false
    user.activeStatus = activeStatus;

    await user.save();

    res.json({
      message: 'Logout successful',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

router.delete('/delete_task/:userId/:taskId', async (req, res) => {
  console.log('DELETE request received:', req.params);
  const { userId, taskId } = req.params;

  try {
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


module.exports = router;