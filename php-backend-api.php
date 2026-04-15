<?php
// api.php - Main API Router
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db.php';

// Simple Router
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
// Remove the base directory if your API is in a subfolder, e.g., /api/
$path = preg_replace('/^.*\/api\//', '', $path);
$path = trim($path, '/'); // Remove leading/trailing slashes
$parts = explode('/', $path);

$endpoint = $parts[0] ?? '';
$sub_endpoint = $parts[1] ?? '';
$id = $parts[2] ?? ($parts[1] ?? null);
$method = $_SERVER['REQUEST_METHOD'];

$input = json_decode(file_get_contents('php://input'), true);

// 1. Auth Routes
if ($endpoint === 'auth') {
    if ($sub_endpoint === 'login' && $method === 'POST') {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(32));
            $expires_at = time() + (24 * 60 * 60); // 24 hours
            
            $stmt = $pdo->prepare("INSERT INTO user_tokens (token, user_id, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$token, $user['id'], $expires_at]);
            
            echo json_encode([
                'token' => $token,
                'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        exit;
    }
    
    if ($sub_endpoint === 'me' && $method === 'GET') {
        $user = authenticateToken($pdo);
        echo json_encode(['user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]]);
        exit;
    }
}

// 2. Settings Routes
if ($endpoint === 'settings') {
    $key = $sub_endpoint;
    
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $result = $stmt->fetch();
        echo json_encode($result ? json_decode($result['setting_value']) : null);
        exit;
    }
    
    if ($method === 'POST') {
        authenticateToken($pdo);
        $value = json_encode($input);
        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmt->execute([$key, $value, $value]);
        echo json_encode(['success' => true]);
        exit;
    }
}

// 3. Generic CRUD Routes
$allowed_tables = ['videos', 'photos', 'screenshots', 'salesReports', 'fbAdsResults', 'whatWeDoVideos'];

if (in_array($endpoint, $allowed_tables)) {
    $table = $endpoint;
    
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM $table ORDER BY createdAt DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    
    if ($method === 'POST') {
        authenticateToken($pdo);
        $keys = array_keys($input);
        $values = array_values($input);
        $placeholders = implode(', ', array_fill(0, count($keys), '?'));
        $columns = implode(', ', $keys);
        
        $stmt = $pdo->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
        $stmt->execute($values);
        $lastId = $pdo->lastInsertId();
        
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
        $stmt->execute([$lastId]);
        echo json_encode($stmt->fetch());
        exit;
    }
    
    if ($method === 'DELETE' && $id) {
        authenticateToken($pdo);
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        exit;
    }
}

// 4. FB CAPI Route
if ($endpoint === 'fb-capi' && $method === 'POST') {
    // Implement FB CAPI logic here using cURL instead of axios
    // ...
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
?>
