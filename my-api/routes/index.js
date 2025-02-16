var express = require('express');
var router = express.Router();
let sqlite3 = require('sqlite3').verbose();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.get('/', function(req, res, next) {
  db.all(`SELECT * FROM todolist`, [], function(err, rows) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
router.get('/to-do-page/:id', function(req, res, next) {
  let db = new sqlite3.Database('./database.db');
  let userId = req.params.id;

  db.all(`SELECT * FROM todolist WHERE user_id = ?`, [userId], function(err, rows) {
    if (err) {
      return console.log(err.message);
    }
    res.json(rows);
    db.close();
  });
});

router.post('/create_todo', async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.body.userId);
    user.tasks.push(req.body);
    await user.save();
    res.json({ message: 'Todo created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

let secretKey = crypto.randomBytes(32).toString('hex');


router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    user.token = token;
    await user.save();
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

function verifyToken(req, res, next) {
  let token =  req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, function(err, decoded) {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    // If the token is valid, save the decoded token to the request for later use
    req.decoded = decoded;
    next();
  });
}
router.delete('/delete_task/:id', verifyToken, function(req, res, next) {
  let db = new sqlite3.Database('./database.db');
  let id = req.params.id;

  db.run(`DELETE FROM todolist WHERE id = ?`, [id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ message: 'Task deleted successfully' });
    db.close();
  });
});



module.exports = router;