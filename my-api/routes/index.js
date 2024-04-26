var express = require('express');
var router = express.Router();
let sqlite3 = require('sqlite3').verbose();
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

router.post('/create_todo', function(req, res, next) { 
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('./database.db');

  let userId = req.body.userId; 
  console.log(userId);

  let title = req.body.title;
  let description = req.body.description;

  db.run('INSERT INTO todolist(user_id, task, description) VALUES(?, ?, ?)', [userId, title, description], function(err) {
    db.close();

    if (err) {
      return console.log(err.message);
    }

    res.json({ message: 'Todo created successfully' });
  });
});

router.post('/register', function(req, res, next) {
  let db = new sqlite3.Database('./database.db');
  let user = req.body;

  db.run(`INSERT INTO users(username, password, email, full_name) VALUES(?, ?, ?, ?)`, [user.username, user.password, user.email, user.fullName], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.json({ message: 'User created successfully' });
    db.close();
  });
});



let secretKey = crypto.randomBytes(32).toString('hex');

router.post('/login', function(req, res, next) {
  let user = req.body;
  let db = new sqlite3.Database('./database.db');

  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [user.username, user.password], function(err, row) {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    let payload = {
      id: row.id,
      username: row.username
    };

    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    res.json({ user: payload, token: token });
    db.close();
  });
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