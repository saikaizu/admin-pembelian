const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: hanya boleh akses kalau sudah login
router.use((req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
});

// List pembelian + join produk + ambil harga
router.get('/', (req, res) => {
  db.query(`SELECT pembelian.*, produk.nama, produk.harga FROM pembelian JOIN produk ON pembelian.produk_id = produk.id`, (err, results) => {
    if (err) throw err;
    res.render('index', { 
      pembelian: results,
      username: req.session.username  // kirim username dari session juga ke view
    });
  });
});

// Form input pembelian
router.get('/input', (req, res) => {
  db.query(`SELECT * FROM produk`, (err, results) => {
    if (err) throw err;
    res.render('input', { produk: results });
  });
});

// Proses input pembelian dan update stok
router.post('/input', (req, res) => {
  const { produk_id, jumlah } = req.body;

  db.query(`INSERT INTO pembelian (produk_id, jumlah) VALUES (?, ?)`, [produk_id, jumlah], (err) => {
    if (err) throw err;

    db.query(`UPDATE stok SET jumlah = jumlah - ? WHERE produk_id = ?`, [jumlah, produk_id], (err) => {
      if (err) throw err;
      res.redirect('/admin');
    });
  });
});

// Cancel pembelian + kembalikan stok
router.post('/cancel/:id', (req, res) => {
  const id = req.params.id;

  db.query(`SELECT * FROM pembelian WHERE id = ?`, [id], (err, rows) => {
    if (err) throw err;
    const pembelian = rows[0];

    db.query(`UPDATE pembelian SET status = 'dibatalkan' WHERE id = ?`, [id], (err) => {
      if (err) throw err;
      db.query(`UPDATE stok SET jumlah = jumlah + ? WHERE produk_id = ?`, [pembelian.jumlah, pembelian.produk_id], (err) => {
        if (err) throw err;
        res.redirect('/admin');
      });
    });
  });
});

// Proses tambah produk baru
router.post('/add-product', (req, res) => {
  const { nama, harga, stok } = req.body;

  // Masukkan produk ke tabel produk
  db.query('INSERT INTO produk (nama, harga) VALUES (?, ?)', [nama, harga], (err, result) => {
    if (err) throw err;

    const produkId = result.insertId;

    // Tambahkan stok awal ke tabel stok
    db.query('INSERT INTO stok (produk_id, jumlah) VALUES (?, ?)', [produkId, stok], (err) => {
      if (err) throw err;
      res.redirect('/admin/add-product');
    });
  });
});

// *** TAMBAHAN ***
// Form tambah produk + tampilkan semua produk
router.get('/add-product', (req, res) => {
  const sql = `
    SELECT produk.id, produk.nama, produk.harga, stok.jumlah 
    FROM produk 
    JOIN stok ON produk.id = stok.produk_id
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('add-product', { produk: results });
  });
});



// Middleware: hanya boleh akses kalau sudah login
router.use((req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
});

// Tampilkan form edit produk
router.get('/edit-product/:id', (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT produk.id, produk.nama, produk.harga, stok.jumlah 
    FROM produk 
    JOIN stok ON produk.id = stok.produk_id 
    WHERE produk.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send('Produk tidak ditemukan.');

    res.render('edit-product', { produk: results[0] });
  });
});

// Proses update produk
router.post('/edit-product/:id', (req, res) => {
  const id = req.params.id;
  const { nama, harga, stok } = req.body;

  const query1 = `UPDATE produk SET nama = ?, harga = ? WHERE id = ?`;
  const query2 = `UPDATE stok SET jumlah = ? WHERE produk_id = ?`;

  db.query(query1, [nama, harga, id], (err) => {
    if (err) throw err;
    db.query(query2, [stok, id], (err) => {
      if (err) throw err;
      res.redirect('/admin/add-product');
    });
  });
});

// Hapus produk
router.post('/delete-product/:id', (req, res) => {
  const id = req.params.id;

  // Hapus stok dulu (foreign key)
  db.query('DELETE FROM stok WHERE produk_id = ?', [id], (err) => {
    if (err) throw err;
    db.query('DELETE FROM produk WHERE id = ?', [id], (err) => {
      if (err) throw err;
      res.redirect('/admin/add-product');
    });
  });
});

module.exports = router;
