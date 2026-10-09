<?php
/**
 * ALBA - API de Profissionais
 * Permite ler e atualizar os dados da página Profissionais e fazer upload de fotos.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/profissionais_data.json';

// Garantir que o arquivo existe
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, '{}');
    @chmod($dataFile, 0666);
} elseif (!is_writable($dataFile)) {
    @chmod($dataFile, 0666);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ============================================================
// ROTAS GET
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = file_get_contents($dataFile);
    if ($data === false || trim($data) === '') {
        echo '{}';
    } else {
        echo $data;
    }
    exit;
}

// ============================================================
// ROTAS POST
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Upload de foto do profissional
    if ($action === 'upload_photo') {
        if (empty($_FILES['photo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhuma foto enviada']);
            exit;
        }

        $file = $_FILES['photo'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Extensão não permitida. Use: ' . implode(', ', $allowed)]);
            exit;
        }

        if ($file['size'] > 10 * 1024 * 1024) { // 10MB max
            http_response_code(400);
            echo json_encode(['error' => 'Foto muito grande. Máximo: 10MB']);
            exit;
        }

        $uploadDir = dirname(__DIR__) . '/uploads/profissionais/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }

        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '-', pathinfo($file['name'], PATHINFO_FILENAME));
        $finalName = 'prof-' . $safeName . '-' . time() . '.' . $ext;
        $dest = $uploadDir . $finalName;

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            echo json_encode(['success' => true, 'url' => '/uploads/profissionais/' . $finalName]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Falha ao salvar a foto no servidor']);
        }
        exit;
    }

    // 2. Salvar os dados do profissional
    $input = file_get_contents('php://input');
    $body = json_decode($input, true);

    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos. Envie um objeto JSON.']);
        exit;
    }

    $result = file_put_contents($dataFile, json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    @chmod($dataFile, 0666);

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao salvar dados no servidor']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $body]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
