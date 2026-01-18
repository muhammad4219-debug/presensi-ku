# 📘 Panduan Instalasi Presensi SMAN 1 Kwanyar

Aplikasi ini dirancang untuk berjalan secara offline menggunakan XAMPP di komputer sekolah. Anda **TIDAK PERLU** API Key Google/Gemini untuk menjalankan fungsi presensi dasar.

## 🛠 Langkah 1: Persiapan XAMPP
1. Pastikan **XAMPP** sudah terinstal di komputer Anda.
2. Buka **XAMPP Control Panel**.
3. Jalankan (Klik Start) pada **Apache** dan **MySQL**.

## 📂 Langkah 2: Menyalin File
1. Buka folder instalasi XAMPP Anda (biasanya di `C:\xampp\htdocs`).
2. Buat folder baru bernama `sman1`.
3. Salin (Copy) seluruh file aplikasi ini ke dalam folder `C:\xampp\htdocs\sman1`.

## 🗄️ Langkah 3: Setup Database Otomatis
1. Buka browser (Chrome/Edge).
2. Ketik alamat: `http://localhost/sman1/db_setup.php`
3. Jika muncul tulisan **"BERHASIL!"**, berarti database MySQL sudah siap digunakan.

## 🚀 Langkah 4: Menjalankan Aplikasi
1. Buka browser.
2. Ketik alamat: `http://localhost/sman1/`
3. Aplikasi siap digunakan!

---

## 🔑 Informasi Login (Default)

| Portal | Username | Password |
|:--- |:--- |:--- |
| **Administrator** | `admin` | `admin123` |
| **Guru BK** | `bk` | `bk123` |

---

## 💡 Tips Penggunaan
1. **Mode Offline**: Data Anda tersimpan di memori browser. Jangan hapus "Cookies/Cache" browser agar data tidak hilang jika tidak menggunakan MySQL.
2. **Backup Rutin**: Gunakan menu **"Database & File"** -> **"Ekspor Database"** setiap hari Sabtu atau akhir bulan. Simpan file `.json` tersebut di Flashdisk sebagai cadangan paling aman.
3. **Pindah Laptop**: Jika ingin pindah laptop, cukup copy folder `sman1` di htdocs ke laptop baru, lalu Impor file `.json` terakhir Anda.

---
*Dibuat untuk SMAN 1 Kwanyar — Efisiensi Digital Tanpa Ribet.*
