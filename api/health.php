<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// Memastikan hanya menerima metode GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method tidak diizinkan. Gunakan GET.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Mengembalikan status kesiapan API
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'API sistem berjalan dengan normal dan siap digunakan.',
    'server_time' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION
], JSON_UNESCAPED_UNICODE);