
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tokoku'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Terkoneksi ke database!');
});

module.exports = db;
