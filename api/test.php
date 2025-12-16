<?php
$conn = new mysqli("localhost", "root", "", "barangayadmin_db");

if ($conn->connect_error) {
  die("DB CONNECTION FAILED: " . $conn->connect_error);
}

echo "CONNECTED TO barangayadmin_db";
