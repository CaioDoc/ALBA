<?php
/**
 * ALBA - API de Cursos
 * Armazena, lê e gerencia cursos e PDFs no servidor.
 * Todos os dispositivos/navegadores veem os mesmos dados.
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

// Arquivo JSON onde os cursos ficam salvos no servidor
$dataFile = __DIR__ . '/cursos_data.json';
$documentsDir = realpath(__DIR__ . '/../documents');
if (!$documentsDir) {
    $documentsDir = dirname(__DIR__) . '/documents';
}

// Garantir que o arquivo de dados existe e tem permissões corretas
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, '[]');
    @chmod($dataFile, 0666);
} else {
    if (!is_writable($dataFile)) {
        @chmod($dataFile, 0666);
    }
}

// Garantir que a pasta de documentos existe
if (!is_dir($documentsDir)) {
    @mkdir($documentsDir, 0755, true);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ========== GET REQUESTS ==========
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // GET ?action=list_pdfs — Lista PDFs disponíveis na pasta documents
    if ($action === 'list_pdfs') {
        $pdfs = [];
        if (is_dir($documentsDir)) {
            $files = scandir($documentsDir);
            foreach ($files as $file) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, ['pdf', 'doc', 'docx', 'txt'])) {
                    $pdfs[] = [
                        'name' => $file,
                        'path' => '/documents/' . $file,
                        'size' => filesize($documentsDir . '/' . $file),
                        'ext' => $ext
                    ];
                }
            }
        }
        echo json_encode($pdfs, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // GET (default) — Retorna todos os cursos
    $data = file_get_contents($dataFile);
    if ($data === false || trim($data) === '') {
        echo '[]';
    } else {
        echo $data;
    }
    exit;
}

// ========== POST REQUESTS ==========
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // POST ?action=upload — Upload de arquivo PDF/DOC
    if ($action === 'upload') {
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhum arquivo enviado.']);
            exit;
        }
        
        $file = $_FILES['file'];
        $allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        if (!in_array($ext, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de arquivo não permitido. Use: PDF, DOC, DOCX ou TXT.']);
            exit;
        }
        
        // Limite de 20MB
        if ($file['size'] > 20 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(['error' => 'Arquivo muito grande. Máximo: 20MB.']);
            exit;
        }
        
        $fileName = $file['name'];
        $destPath = $documentsDir . '/' . $fileName;
        
        // Se já existe um arquivo com o mesmo nome, adicionar timestamp
        if (file_exists($destPath)) {
            $baseName = pathinfo($fileName, PATHINFO_FILENAME);
            $fileName = $baseName . '_' . time() . '.' . $ext;
            $destPath = $documentsDir . '/' . $fileName;
        }
        
        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            @chmod($destPath, 0644);
            echo json_encode([
                'success' => true,
                'fileName' => $fileName,
                'path' => '/documents/' . $fileName,
                'size' => $file['size']
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salvar o arquivo no servidor.']);
        }
        exit;
    }
    
    // POST (default) — Salva a lista completa de cursos
    $input = file_get_contents('php://input');
    $courses = json_decode($input, true);
    
    if (!is_array($courses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos. Envie um array JSON de cursos.']);
        exit;
    }
    
    $result = file_put_contents($dataFile, json_encode($courses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao salvar dados no servidor.']);
        exit;
    }
    
    echo json_encode(['success' => true, 'count' => count($courses)]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido.']);
