<?php
// Always set CORS headers first
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Simulate authentication
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // For demo purposes, accept these credentials
    if ($email === 'admin@example.com' && $password === 'password123') {
        echo json_encode([
            'success' => true,
            'message' => 'User logged in successfully',
            'data' => [
                'user' => [
                    'id' => 1,
                    'name' => 'Admin User',
                    'email' => $email,
                    'role' => 'admin'
                ],
                'access_token' => 'demo_token_' . bin2hex(random_bytes(16)),
                'token_type' => 'Bearer',
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid login credentials'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
