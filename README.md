# 🛒 Aplikasi Admin Pembelian
(Referensi AI dan YouTube code by Sai Pratama)

Aplikasi admin sederhana untuk **mengelola produk, stok, pembelian, dan pembatalan transaksi**. Dibuat dengan:

- Node.js + Express
- MySQL
- EJS + Tailwind CSS

---

## ⚙️ Prasyarat

- [Node.js](https://nodejs.org/)
- [XAMPP ataupun Laragon]

---

## 🚀 Cara Setup

### 1. Clone & Install

```bash
git clone <repo-ini>
pastikan di pindahkan ke folder root atau www dari webserver anda
gunakan terminal dan sejenisnya (lebih bagus menggunakan GIT)
masuk ke direktori dari file aplikasinya dengan command tapi git bash dulu ke folder root atau www dari webserver anda

pastikan node.js telah terinstall

masukan command:
cd admin-pembelian
lalu
npm install
```

### 2. Setup Database

- Buat database baru di MySQL, misalnya: `tokoku`
- Import file `schema.sql` jika tersedia (atau buat query manual)

### 3. Konfigurasi Koneksi MySQL

Bisa disesuaikan dengan database anda.

Edit file `config/db.js`:

```js
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tokoku'
});
```

### 4. Jalankan Aplikasi

```bash
npm start atau node app.js
```

Buka di browser:

```
http://localhost:3000
```

---

## ✨ Fitur

- Tambah produk + stok
- Edit dan hapus produk
- Lihat daftar produk lengkap
- Desain UI menggunakan Tailwind CSS

---

## 📦 Struktur Folder

```
admin-pembelian/
├── routes/
│   └── admin.js
├── views/
│   ├── index.ejs
│   └── add-product.ejs
├── config/
│   └── db.js
├── public/
├── app.js
└── package.json
```

---

## 🤝 Lisensi

Boleh dipakai buat belajar, proyek pribadi, atau dimodif bebas
Terima kasih....
