<?php
header('Content-Type: application/json');

// ALWAYS enable error reporting during dev
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Make sure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid request method'
  ]);
  exit;
}

// Example: basic validation
if (empty($_POST['request_type'])) {
  echo json_encode([
    'success' => false,
    'message' => 'Missing request type'
  ]);
  exit;
}

// ✅ If everything is OK
echo json_encode([
  'success' => true,
  'tracking_code' => 'BRGY-' . rand(100000, 999999)
]);
exit;
