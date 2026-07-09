<?php
// Configurações do Banco de Dados cPanel
define('DB_HOST', 'localhost');
define('DB_USER', 'ayurvedi_loja'); // Substituir pelo usuário criado no cPanel
define('DB_PASS', 'SUA_SENHA_DO_BANCO'); // Substituir pela senha do banco
define('DB_NAME', 'ayurvedi_loja'); // Substituir pelo nome do banco

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(["error" => "Erro de conexão com o banco de dados."]));
}
?>
