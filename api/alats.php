<?php
declare(strict_types=1);

// Mengatur header agar respons berupa JSON dengan standar UTF-8
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
// 1. METODE GET: Mengambil Data Inventaris
// ==========================================
if ($method === 'GET') {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data' => [
            ['id' => 1, 'nama' => 'Router', 'jumlah' => 4],
            ['id' => 2, 'nama' => 'Multimeter', 'jumlah' => 6]
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ==========================================
// 2. METODE POST: Validasi Payload & Data
// ==========================================
if ($method === 'POST') {
    
    // KONDISI 2: Menangani JSON Rusak / Invalid (Status 400)
    try {
        $payload = json_decode(
            file_get_contents('php://input'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    } catch (JsonException $e) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Format JSON tidak valid (Malformed JSON)'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Memastikan payload berbentuk array/objek
    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Body JSON harus berupa object'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Mengambil dan membersihkan input data
    $nama = trim((string)($payload['nama'] ?? ''));
    $jumlah = filter_var($payload['jumlah'] ?? null, FILTER_VALIDATE_INT);

    // KONDISI 3: Aturan Bisnis Tidak Terpenuhi (Status 422)
    // Menolak jika nama kosong, jumlah bukan angka, atau jumlah bernilai negatif (< 0)
    if ($nama === '' || $jumlah === false || $jumlah < 0) {
        http_response_code(422);
        echo json_encode([
            'status' => 'error',
            'message' => 'Data tidak valid: Nama wajib diisi dan jumlah harus berupa angka positif.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // KONDISI 1: JSON Valid & Aturan Terpenuhi (Status 201 Created)
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Data alat berhasil diterima dan diproses',
        'data' => [
            'nama' => $nama,
            'jumlah' => $jumlah
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Jika metode HTTP selain GET atau POST
header('Allow: GET, POST');
http_response_code(405);
echo json_encode([
    'status' => 'error',
    'message' => 'Method tidak diizinkan'
], JSON_UNESCAPED_UNICODE);