<?php
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Simple test endpoint
if ($_SERVER['REQUEST_URI'] === '/test.php') {
    echo json_encode([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Simple login test endpoint
if ($_SERVER['REQUEST_URI'] === '/login-test.php' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login test successful',
        'data' => [
            'user' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => $input['email'] ?? 'test@example.com',
                'role' => 'admin'
            ],
            'access_token' => 'test_token_123',
            'token_type' => 'Bearer',
        ]
    ]);
    exit;
}

echo json_encode(['error' => 'Endpoint not found']);
?>
