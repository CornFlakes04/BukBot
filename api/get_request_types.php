<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "barangayadmin_db");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$sql = "
  SELECT id, name, slug
  FROM request_types
  WHERE is_active = 1
    AND is_archived = 0
  ORDER BY name ASC
";


$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
