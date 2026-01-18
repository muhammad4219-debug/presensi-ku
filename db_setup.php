<?php
/**
 * Setup Database SMAN 1 Kwanyar
 * Jalankan ini sekali di browser: http://localhost/sman1/db_setup.php
 */
$host = "localhost";
$user = "root";
$pass = "";
$db   = "sman1_kwanyar_db";

echo "<h2>Inisialisasi Database SMAN 1 Kwanyar...</h2>";

// 1. Koneksi ke MySQL
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("<p style='color:red'>Gagal koneksi ke XAMPP: " . $conn->connect_error . "</p>");
}
echo "<p>✔️ Terhubung ke MySQL XAMPP.</p>";

// 2. Buat Database
if ($conn->query("CREATE DATABASE IF NOT EXISTS $db")) {
    echo "<p>✔️ Database '$db' siap.</p>";
} else {
    die("<p style='color:red'>Gagal buat database: " . $conn->error . "</p>");
}

$conn->select_db($db);

// 3. Buat Tabel
$table_sql = "CREATE TABLE IF NOT EXISTS school_data (
    id INT PRIMARY KEY,
    content LONGTEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($table_sql)) {
    echo "<p>✔️ Tabel 'school_data' siap.</p>";
} else {
    die("<p style='color:red'>Gagal buat tabel: " . $conn->error . "</p>");
}

echo "<hr><h3 style='color:green'>BERHASIL!</h3>";
echo "<p>Sekarang Anda bisa membuka aplikasi di: <a href='/sman1/'>localhost/sman1/</a></p>";

$conn->close();
?>