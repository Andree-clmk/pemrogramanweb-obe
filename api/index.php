<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// Menangani permintaan GET
if ($method === 'GET') {
    http_response_code(200);
    echo json_encode([
        'data' => [
            ['id' => 1, 'nama' => 'Router', 'jumlah' => 4],
            ['id' => 2, 'nama' => 'Multimeter', 'jumlah' => 6]
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Menangani permintaan POST dengan validasi JSON
if ($method === 'POST') {
    try {
        $payload = json_decode(
            file_get_contents('php://input'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    } catch (JsonException $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Format JSON tidak valid']);
        exit;
    }

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['error' => 'Body JSON harus berupa object']);
        exit;
    }

    $nama = trim((string)($payload['nama'] ?? ''));
    $jumlah = filter_var($payload['jumlah'] ?? null, FILTER_VALIDATE_INT);

    if ($nama === '' || $jumlah === false || $jumlah < 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Data tidak valid']);
        exit;
    }

    http_response_code(201);
    echo json_encode(['message' => 'Data diterima', 'data' => compact('nama', 'jumlah')]);
    exit;
}

// Jika metode HTTP selain GET atau POST
header('Allow: GET, POST');
http_response_code(405);
echo json_encode(['error' => 'Method tidak diizinkan']);