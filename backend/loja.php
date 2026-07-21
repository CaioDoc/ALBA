<?php
// Permitir acesso do site (CORS) - Altere o * para https://seu-site-github.com quando colocar em produção se quiser mais segurança
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for requisição OPTIONS (Preflight do CORS do navegador), apenas retorna sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Listar produtos
    $stmt = $pdo->query("SELECT * FROM produtos_loja ORDER BY created_at DESC");
    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($produtos);
} 
elseif ($method === 'POST') {
    // Criar ou Atualizar produto
    $data = json_decode(file_get_contents("php://input"), true);
    
    if(!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Dados inválidos"]);
        exit();
    }

    $id = $data['id'] ?? 'prod-' . time();
    $title = $data['title'] ?? '';
    $category = $data['category'] ?? '';
    $price = $data['price'] ?? '';
    $image = $data['image'] ?? '';
    $description = $data['description'] ?? '';
    $hotmartLink = $data['hotmartLink'] ?? '';
    $status = $data['status'] ?? 'Ativo';

    // Usando REPLACE INTO (Se o ID já existir, ele atualiza, se não, cria um novo)
    $stmt = $pdo->prepare("REPLACE INTO produtos_loja (id, title, category, price, image, description, hotmartLink, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $title, $category, $price, $image, $description, $hotmartLink, $status]);

    echo json_encode(["success" => true, "id" => $id]);
}
elseif ($method === 'DELETE') {
    // Deletar produto
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM produtos_loja WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "ID não fornecido"]);
    }
}
?>
