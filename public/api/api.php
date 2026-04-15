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

// Robust routing
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];

// Extract the path part of the URI (ignore query string)
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove the script name from the path if it exists (e.g. /api/api.php/settings -> /settings)
if (strpos($path, $script_name) === 0) {
    $path = substr($path, strlen($script_name));
} else {
    // Fallback: if they are using URL rewriting (e.g., /api/settings -> /api/api.php)
    // We can just look for the part after /api/
    $path = preg_replace('/^.*api\.php\/?/', '', $path);
    $path = preg_replace('/^.*\/api\//', '', $path);
}

$path = trim($path, '/');
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
    $eventName = $input['eventName'] ?? '';
    $eventData = $input['eventData'] ?? [];
    $userData = $input['userData'] ?? [];
    $sourceUrl = $input['sourceUrl'] ?? 'https://socialaddstudio.com';

    $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'tracking_private'");
    $stmt->execute();
    $result = $stmt->fetch();
    
    if (!$result) {
        http_response_code(404);
        echo json_encode(['error' => 'Tracking settings not found']);
        exit;
    }

    $settings = json_decode($result['setting_value'], true);
    $fbPixelId = $settings['fbPixelId'] ?? '';
    $fbAccessToken = $settings['fbAccessToken'] ?? '';
    $fbTestEventCode = $settings['fbTestEventCode'] ?? '';

    if (!$fbPixelId || !$fbAccessToken) {
        http_response_code(400);
        echo json_encode(['error' => 'Facebook Pixel ID or Access Token missing']);
        exit;
    }

    $payload = [
        'data' => [
            [
                'event_name' => $eventName,
                'event_time' => time(),
                'action_source' => 'website',
                'event_source_url' => $sourceUrl,
                'user_data' => array_merge([
                    'client_ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
                    'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
                ], $userData),
                'custom_data' => $eventData
            ]
        ]
    ];
    
    if ($fbTestEventCode) {
        $payload['test_event_code'] = $fbTestEventCode;
    }

    $ch = curl_init("https://graph.facebook.com/v17.0/{$fbPixelId}/events?access_token={$fbAccessToken}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode(['success' => true, 'fbResponse' => json_decode($response)]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send event to Facebook CAPI', 'details' => json_decode($response)]);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'path' => $path, 'endpoint' => $endpoint]);
?>
