<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

$to = 'info@ayurvedica.org';
$subject = $data['subject'] ?? 'Nova Mensagem do Site ALBA';
$from_name = $data['from_name'] ?? 'Visitante';
$from_email = $data['email'] ?? 'info@ayurvedica.org';
$message = $data['message'] ?? '';
$phone = $data['phone'] ?? '';
$category = $data['category'] ?? '';

// Format the email body
$body = "Você recebeu uma nova mensagem pelo site da ALBA.\n\n";
$body .= "Nome: $from_name\n";
if (!empty($from_email)) $body .= "Email: $from_email\n";
if (!empty($phone)) $body .= "Telefone: $phone\n";
if (!empty($category)) $body .= "Categoria: $category\n";
$body .= "\nMensagem:\n$message\n";

$encoded_subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
$encoded_from_name = "=?UTF-8?B?" . base64_encode($from_name) . "?=";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: $encoded_from_name <$to>\r\n";
if (!empty($data['email'])) {
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
}
$headers .= "X-Mailer: PHP/" . phpversion();

$success = mail($to, $encoded_subject, $body, $headers);

if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
