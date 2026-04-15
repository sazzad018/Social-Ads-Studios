<?php
header('Content-Type: application/json');
require_once 'db.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$eventName = $data['eventName'] ?? '';
$eventData = $data['eventData'] ?? [];
$userData = $data['userData'] ?? [];
$sourceUrl = $data['sourceUrl'] ?? 'https://yourdomain.com';

try {
    $stmt = $pdo->query("SELECT key_name, key_value FROM settings WHERE key_name IN ('fbPixelId', 'fbAccessToken', 'fbTestEventCode')");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['key_name']] = $row['key_value'];
    }

    $fbPixelId = $settings['fbPixelId'] ?? null;
    $fbAccessToken = $settings['fbAccessToken'] ?? null;
    $fbTestEventCode = $settings['fbTestEventCode'] ?? null;

    if (!$fbPixelId || !$fbAccessToken) {
        http_response_code(400);
        echo json_encode(['error' => 'Facebook Pixel ID or Access Token missing']);
        exit;
    }

    $clientIpAddress = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    $clientUserAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $payloadData = [
        'event_name' => $eventName,
        'event_time' => time(),
        'action_source' => 'website',
        'event_source_url' => $sourceUrl,
        'user_data' => array_merge([
            'client_ip_address' => $clientIpAddress,
            'client_user_agent' => $clientUserAgent
        ], $userData),
        'custom_data' => $eventData
    ];

    $payload = ['data' => [$payloadData]];
    if (!empty($fbTestEventCode)) {
        $payload['test_event_code'] = $fbTestEventCode;
    }

    $url = "https://graph.facebook.com/v17.0/{$fbPixelId}/events?access_token={$fbAccessToken}";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode(['success' => true, 'fbResponse' => json_decode($response)]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send event to Facebook CAPI', 'details' => json_decode($response)]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
}
?>
