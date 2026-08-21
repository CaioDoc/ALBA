<?php
/**
 * ALBA - API de Agenda de Eventos
 * Armazena e lê eventos em um arquivo JSON no servidor.
 * Assim todos os dispositivos/navegadores veem os mesmos dados.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Arquivo JSON onde os eventos ficam salvos no servidor
$dataFile = __DIR__ . '/agenda_data.json';

// Garantir que o arquivo existe e tem permissões corretas
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, '[]');
    chmod($dataFile, 0666);
} else {
    // Corrigir permissões automaticamente se necessário
    if (!is_writable($dataFile)) {
        @chmod($dataFile, 0666);
    }
}

// GET - Retorna todos os eventos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = file_get_contents($dataFile);
    if ($data === false || trim($data) === '') {
        echo '[]';
    } else {
        echo $data;
    }
    exit;
}

// POST - Salva a lista completa de eventos (substituição total)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $events = json_decode($input, true);
    
    if (!is_array($events)) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos. Envie um array JSON de eventos.']);
        exit;
    }
    
    $result = file_put_contents($dataFile, json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao salvar dados no servidor. Verifique as permissões do arquivo agenda_data.json']);
        exit;
    }
    
    echo json_encode(['success' => true, 'count' => count($events)]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido.']);
