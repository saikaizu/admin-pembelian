const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(session({
  secret: 'rahasia_admin',   // Ganti dengan string acak yang kuat di production
  resave: false,
  saveUninitialized: true
}));

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin'); // Gagal logout, redirect ke dashboard
    }
    res.clearCookie('connect.sid'); // Hapus cookie session
    res.redirect('/login'); // Redirect ke halaman login
  });
});


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.redirect('/admin');
});

app.listen(3000, () => {
  console.log('🔥 Server nyala di http://localhost:3000');
});
