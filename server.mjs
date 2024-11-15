// server.js atau server.mjs (menggunakan "type": "module" di package.json)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari .env
dotenv.config({ path: './backend/.env' });

// Menentukan path direktori
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5500;

// Import backend app menggunakan sintaks ES Module
import backendApp from './backend/app.js';

// Static file serving (untuk file frontend)
app.use(express.static(path.join(__dirname, 'frontend')));

// Mengarahkan semua permintaan ke backend app dengan prefix /api
app.use('/api', backendApp);

// Rute untuk frontend (mengarah ke index.html sebagai halaman utama)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});