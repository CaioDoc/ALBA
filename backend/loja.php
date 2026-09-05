<?php
/**
 * ALBA - API da Loja e Pedidos
 * Fluxo seguro: pedido criado como "Aguardando Verificação" até admin aprovar manualmente.
 * Ao marcar como "Pago", o sistema envia o e-mail com link do Drive ao cliente.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$produtosFile = __DIR__ . '/loja_produtos.json';
$pedidosFile  = __DIR__ . '/loja_pedidos.json';

foreach ([$produtosFile, $pedidosFile] as $f) {
    if (!file_exists($f)) {
        file_put_contents($f, '[]');
        @chmod($f, 0666);
    } elseif (!is_writable($f)) {
        @chmod($f, 0666);
    }
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ============================================================
// E-MAIL: Notificação para o Admin (novo pedido aguardando)
// ============================================================
function emailAdmin($pedido) {
    $para    = 'contato@ayurvedica.org';
    $assunto = "[PEDIDO AGUARDANDO #{$pedido['id']}] {$pedido['product']['title']} — {$pedido['customer']['name']}";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: ALBA Loja <noreply@ayurvedica.org>\r\n";
    $headers .= "Reply-To: {$pedido['customer']['email']}\r\n";

    $tipo = $pedido['product']['type'] === 'digital' ? '✨ Digital (Drive)' : '📦 Físico (Correios)';
    $endHtml = '';
    if ($pedido['product']['type'] === 'fisico' && !empty($pedido['customer']['address'])) {
        $a = $pedido['customer']['address'];
        $endHtml = "
        <h3 style='color:#065f46;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-top:24px;'>Endereço de Entrega</h3>
        <p style='margin:4px 0;'>{$a['street']}, {$a['number']}" . (!empty($a['complement']) ? " ({$a['complement']})" : '') . "</p>
        <p style='margin:4px 0;'>{$a['neighborhood']} — {$a['city']}/{$a['state']}</p>
        <p style='margin:4px 0;'>CEP: {$a['cep']}</p>";
    }

    $corpo = "
    <!DOCTYPE html><html><head><meta charset='utf-8'></head>
    <body style='font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f7f7f7;padding:20px;'>
    <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #eaeaea;'>
        <div style='background:#b45309;color:#fff;padding:24px;text-align:center;'>
            <h1 style='margin:0;font-size:22px;font-weight:normal;'>⏳ Novo Pedido — Aguardando Verificação PIX</h1>
            <p style='margin:5px 0 0;opacity:0.9;font-size:14px;'>Pedido #{$pedido['id']} • ALBA Loja</p>
        </div>
        <div style='padding:24px;'>
            <div style='background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:20px;'>
                <strong>⚠️ Ação necessária:</strong> Confirme o pagamento PIX no seu banco e então acesse o painel de pedidos para marcar como <strong>\"Pago\"</strong>. O link do Google Drive será enviado ao cliente automaticamente.
            </div>
            <h3 style='color:#065f46;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-top:0;'>Produto</h3>
            <p style='margin:4px 0;font-size:16px;'><strong>{$pedido['product']['title']}</strong></p>
            <p style='margin:4px 0;'><strong>Tipo:</strong> {$tipo}</p>
            <p style='margin:4px 0;'><strong>Valor:</strong> <span style='color:#047857;font-weight:bold;font-size:16px;'>{$pedido['product']['price']}</span></p>
            <h3 style='color:#065f46;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-top:24px;'>Dados do Comprador</h3>
            <p style='margin:4px 0;'><strong>Nome:</strong> {$pedido['customer']['name']}</p>
            <p style='margin:4px 0;'><strong>CPF:</strong> {$pedido['customer']['cpf']}</p>
            <p style='margin:4px 0;'><strong>E-mail:</strong> <a href='mailto:{$pedido['customer']['email']}'>{$pedido['customer']['email']}</a></p>
            <p style='margin:4px 0;'><strong>WhatsApp:</strong> <a href='https://wa.me/55" . preg_replace('/\D/', '', $pedido['customer']['phone']) . "'>{$pedido['customer']['phone']}</a></p>
            {$endHtml}
            <div style='margin-top:30px;text-align:center;border-top:1px solid #eee;padding-top:20px;'>
                <a href='https://ayurvedica.org/admin/loja/' style='background:#065f46;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;'>Acessar Painel de Pedidos →</a>
            </div>
        </div>
    </div></body></html>";

    @mail($para, $assunto, $corpo, $headers);
}

// ============================================================
// E-MAIL: Confirmação de recebimento para o Cliente (sem link)
// ============================================================
function emailClienteAguardando($pedido) {
    $para    = $pedido['customer']['email'];
    $assunto = "Pedido #{$pedido['id']} recebido — Aguardando confirmação do pagamento";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: ALBA Ayurveda <contato@ayurvedica.org>\r\n";

    $corpo = "
    <!DOCTYPE html><html><head><meta charset='utf-8'></head>
    <body style='font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f7f7f7;padding:20px;'>
    <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #eaeaea;'>
        <div style='background:#065f46;color:#fff;padding:24px;text-align:center;'>
            <h1 style='margin:0;font-size:22px;font-weight:normal;'>Pedido Recebido com Sucesso!</h1>
            <p style='margin:5px 0 0;opacity:0.9;font-size:14px;'>Pedido #{$pedido['id']} — ALBA</p>
        </div>
        <div style='padding:24px;'>
            <p>Olá, <strong>{$pedido['customer']['name']}</strong>!</p>
            <p>Recebemos seu pedido de <strong>{$pedido['product']['title']}</strong> no valor de <strong>{$pedido['product']['price']}</strong>.</p>

            <div style='background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;'>
                <strong>⏳ Aguardando confirmação do PIX</strong><br>
                Estamos verificando o pagamento. Em breve você receberá um novo e-mail com o link de acesso ao seu material.
            </div>

            <p style='font-size:13px;color:#6b7280;'>Em caso de dúvidas, responda a este e-mail ou entre em contato com a ALBA.</p>
        </div>
    </div></body></html>";

    @mail($para, $assunto, $corpo, $headers);
}

// ============================================================
// E-MAIL: Liberação do acesso ao cliente (após admin aprovar)
// ============================================================
function emailClienteAprovado($pedido) {
    $para    = $pedido['customer']['email'];
    $assunto = "✅ Pagamento confirmado! Acesse seu material — Pedido #{$pedido['id']}";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: ALBA Ayurveda <contato@ayurvedica.org>\r\n";

    $tipo = $pedido['product']['type'];
    if ($tipo === 'digital' && !empty($pedido['product']['digitalUrl'])) {
        $acessoHtml = "
        <div style='background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:20px;margin:20px 0;text-align:center;'>
            <h3 style='color:#065f46;margin-top:0;'>🎉 Seu Acesso Digital Está Liberado!</h3>
            <p style='margin:8px 0 16px;color:#047857;'>Clique no botão abaixo para acessar seu material no Google Drive:</p>
            <a href='{$pedido['product']['digitalUrl']}' target='_blank' style='background:#059669;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;'>Acessar Material no Google Drive</a>
            <p style='font-size:12px;color:#6b7280;margin-top:12px;'>Guarde este e-mail para acessar sempre que precisar.</p>
        </div>";
    } else {
        $acessoHtml = "
        <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;'>
            <h3 style='color:#166534;margin-top:0;'>🚚 Pagamento Confirmado — Preparando Envio</h3>
            <p style='margin:4px 0;color:#374151;'>Nossa equipe já está separando seu produto para envio. Em breve você receberá o código de rastreamento.</p>
        </div>";
    }

    $corpo = "
    <!DOCTYPE html><html><head><meta charset='utf-8'></head>
    <body style='font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f7f7f7;padding:20px;'>
    <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #eaeaea;'>
        <div style='background:#065f46;color:#fff;padding:24px;text-align:center;'>
            <h1 style='margin:0;font-size:22px;font-weight:normal;'>Pagamento Confirmado!</h1>
            <p style='margin:5px 0 0;opacity:0.9;font-size:14px;'>Pedido #{$pedido['id']} — ALBA</p>
        </div>
        <div style='padding:24px;'>
            <p>Olá, <strong>{$pedido['customer']['name']}</strong>!</p>
            <p>Seu pagamento de <strong>{$pedido['product']['price']}</strong> para <strong>{$pedido['product']['title']}</strong> foi confirmado com sucesso.</p>
            {$acessoHtml}
            <p style='font-size:13px;color:#6b7280;'>Em caso de dúvidas, responda a este e-mail.</p>
        </div>
    </div></body></html>";

    @mail($para, $assunto, $corpo, $headers);
}

// ============================================================
// ROTAS GET
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if ($action === 'products' || empty($action)) {
        $data = file_get_contents($produtosFile);
        echo ($data === false || trim($data) === '') ? '[]' : $data;
        exit;
    }

    if ($action === 'orders') {
        $data = file_get_contents($pedidosFile);
        echo ($data === false || trim($data) === '') ? '[]' : $data;
        exit;
    }
}

// ============================================================
// ROTAS POST
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 0. Upload de imagem de capa (multipart/form-data)
    if ($action === 'upload_image') {
        if (empty($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhuma imagem enviada']);
            exit;
        }
        $file = $_FILES['image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Extensão não permitida. Use: ' . implode(', ', $allowed)]);
            exit;
        }
        if ($file['size'] > 5 * 1024 * 1024) { // 5MB max
            http_response_code(400);
            echo json_encode(['error' => 'Imagem muito grande. Máximo: 5MB']);
            exit;
        }
        $uploadDir = dirname(__DIR__) . '/uploads/loja/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '-', pathinfo($file['name'], PATHINFO_FILENAME));
        $finalName = $safeName . '-' . time() . '.' . $ext;
        $dest = $uploadDir . $finalName;
        if (move_uploaded_file($file['tmp_name'], $dest)) {
            echo json_encode(['success' => true, 'url' => '/uploads/loja/' . $finalName]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Falha ao salvar a imagem no servidor']);
        }
        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);

    // 1. Salvar produtos (Admin)
    if ($action === 'save_products') {
        if (!is_array($body)) { http_response_code(400); echo json_encode(['error' => 'Array inválido']); exit; }
        file_put_contents($produtosFile, json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'count' => count($body)]);
        exit;
    }

    // 2. Criar pedido — status "Aguardando Verificação"
    if ($action === 'create_order') {
        if (!$body || empty($body['customer']) || empty($body['product'])) {
            http_response_code(400); echo json_encode(['error' => 'Dados incompletos']); exit;
        }

        $pedidos = [];
        if (file_exists($pedidosFile)) {
            $raw = file_get_contents($pedidosFile);
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) $pedidos = $decoded;
        }

        $orderId = 'PED-' . date('Y') . '-' . str_pad(strval(rand(1000, 9999)), 4, '0', STR_PAD_LEFT);

        $novoPedido = [
            'id'        => $orderId,
            'createdAt' => date('c'),
            'status'    => 'Aguardando Verificação', // ← NUNCA libera direto
            'customer'  => [
                'name'    => trim($body['customer']['name'] ?? ''),
                'cpf'     => trim($body['customer']['cpf'] ?? ''),
                'email'   => trim($body['customer']['email'] ?? ''),
                'phone'   => trim($body['customer']['phone'] ?? ''),
                'address' => $body['customer']['address'] ?? null
            ],
            'product' => [
                'id'         => $body['product']['id'] ?? '',
                'title'      => $body['product']['title'] ?? '',
                'category'   => $body['product']['category'] ?? '',
                'type'       => $body['product']['type'] ?? 'digital',
                'price'      => $body['product']['price'] ?? '',
                'digitalUrl' => $body['product']['digitalUrl'] ?? ''
            ],
            'payment' => [
                'method' => 'pix',
                'status' => 'Pendente'
            ],
            'trackingCode' => '',
            'notes'        => ''
        ];

        array_unshift($pedidos, $novoPedido);
        file_put_contents($pedidosFile, json_encode($pedidos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // E-mails: admin (alerta) + cliente (aguardando — SEM link)
        emailAdmin($novoPedido);
        emailClienteAguardando($novoPedido);

        echo json_encode(['success' => true, 'order' => $novoPedido], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. Atualizar status (Admin) — ao marcar "Pago" envia e-mail com Drive ao cliente
    if ($action === 'update_order_status') {
        if (empty($body['orderId'])) {
            http_response_code(400); echo json_encode(['error' => 'ID obrigatório']); exit;
        }

        $pedidos = [];
        if (file_exists($pedidosFile)) {
            $raw = file_get_contents($pedidosFile);
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) $pedidos = $decoded;
        }

        $found = false;
        $pedidoAtualizado = null;
        $statusAnterior = '';

        foreach ($pedidos as &$p) {
            if ($p['id'] === $body['orderId']) {
                $statusAnterior = $p['status'];
                if (isset($body['status']))       $p['status']       = $body['status'];
                if (isset($body['trackingCode'])) $p['trackingCode'] = $body['trackingCode'];
                if (isset($body['notes']))        $p['notes']        = $body['notes'];
                $pedidoAtualizado = $p;
                $found = true;
                break;
            }
        }
        unset($p);

        if (!$found) {
            http_response_code(404); echo json_encode(['error' => 'Pedido não encontrado']); exit;
        }

        file_put_contents($pedidosFile, json_encode($pedidos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // ← Disparar e-mail de acesso SOMENTE quando admin mudar para "Pago"
        $novoStatus = $body['status'] ?? '';
        if (in_array($novoStatus, ['Pago', 'Concluído']) && !in_array($statusAnterior, ['Pago', 'Concluído'])) {
            emailClienteAprovado($pedidoAtualizado);
        }

        echo json_encode(['success' => true]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
