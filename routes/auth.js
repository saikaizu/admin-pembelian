const express = require('express');
const router = express.Router();
const db = require('../db');

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Proses login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/admin');
    } else {
      res.send('Login gagal. <a href="/login">Coba lagi</a>');
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect('/login');
  });
});

module.exports = router;
