<?php
/**
 * API Backend Presensi SMAN 1 Kwanyar (XAMPP Optimized)
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "sman1_kwanyar_db";

// Koneksi tanpa pilih DB dulu
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Cek XAMPP: MySQL belum jalan."]));
}

// Cek apakah DB ada
$db_check = $conn->select_db($db);
if (!$db_check) {
    echo json_encode(["status" => "error", "message" => "Database belum siap. Jalankan db_setup.php dulu."]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Penanganan Request
if ($method === 'GET') {
    $result = $conn->query("SELECT content FROM school_data WHERE id = 1");
    if ($result && $row = $result->fetch_assoc()) {
        echo $row['content'];
    } else {
        echo json_encode(["status" => "empty", "message" => "Database kosong."]);
    }
} 
else if ($method === 'POST') {
    if (isset($input['content'])) {
        $safe_data = $conn->real_escape_string(json_encode($input['content']));
        $sql = "INSERT INTO school_data (id, content) VALUES (1, '$safe_data') 
                ON DUPLICATE KEY UPDATE content = '$safe_data'";
        
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Tersimpan di MySQL"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}
$conn->close();
?>