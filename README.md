# vocabify-app

### How to Run

1. **Clone Repository**
   - Buka terminal dan clone repository menggunakan perintah berikut:
     ```bash
     git clone <repository-url>
     ```
   - Gantilah `<repository-url>` dengan URL repository yang sebenarnya.

2. **Masuk ke Direktori Backend**
   - Pindah ke folder backend dengan perintah:
     ```bash
     cd path/to/repository/backend
     ```

3. **Install Dependensi Backend**
   - Install dependensi yang diperlukan untuk backend:
     ```bash
     npm install
     ```

4. **Jalankan Server Backend**
   - Jalankan server backend dengan perintah:
     ```bash
     node app.js
     ```
   - Server sekarang seharusnya berjalan secara lokal, biasanya di `http://localhost:3000` kecuali jika telah dikonfigurasi lain.

5. **Buka Frontend**
   - Kembali ke direktori utama proyek:
     ```bash
     cd ../frontend
     ```
   - Buka file `index.html` di browser Anda. Anda dapat melakukannya dengan mengklik dua kali file tersebut atau menggunakan salah satu perintah berikut:
     ```bash
     open index.html # Untuk macOS
     start index.html # Untuk Windows
     xdg-open index.html # Untuk Linux
     ```
   - Atau, Anda juga bisa menggunakan ekstensi live server jika menggunakan editor kode seperti VS Code.

## Fitur yang ditambahkan
1. Register, Login dan Logout
2. Penyimpanan state pengguna saat menggunakan Scrambify (berapa soal yang sudah diselesaikan pengguna)
