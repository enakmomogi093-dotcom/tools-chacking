# WA CHECKER KENZ

Aplikasi React + Vite untuk memvalidasi format nomor telepon dan membuka chat WhatsApp.

## Jalankan lokal
1. Install Node.js versi 18 atau lebih baru.
2. Ekstrak ZIP ini.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.
5. Buka alamat lokal yang ditampilkan Vite.

## Deploy ke Vercel
1. Upload project ke repository GitHub.
2. Import repository di Vercel.
3. Framework Preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Klik Deploy.

## Batasan pemeriksaan
WhatsApp tidak menyediakan API publik untuk memastikan apakah nomor pihak lain sedang aktif, dibanned, atau dinonaktifkan. Aplikasi ini hanya memvalidasi format nomor secara lokal. Hasil validasi format bukan bukti bahwa akun WhatsApp aktif atau bebas banned.

Nomor tidak dikirim ke server oleh aplikasi ini. Riwayat disimpan di localStorage browser perangkat pengguna.
