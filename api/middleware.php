<?php
function validateJsonRequest() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        $contentType = isset($_SERVER['CONTENT_TYPE']) ? trim($_SERVER['CONTENT_TYPE']) : '';
        if (strpos($contentType, 'application/json') === false) {
            http_response_code(415);
            echo json_encode(["status" => "error", "message" => "Content-Type harus application/json"]);
            exit();
        }
    }
}