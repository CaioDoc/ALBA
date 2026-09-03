<?php
/**
 * ALBA - API da Loja e Pedidos
 * Gerencia produtos, checkout, compras e disparo de e-mails de notificação
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
$pedidosFile = __DIR__ . '/loja_pedidos.json';

// Inicializar arquivos com permissão
if (!file_exists($produtosFile)) {
    file_put_contents($produtosFile, '[]');
    @chmod($produtosFile, 0666);
} else if (!is_writable($produtosFile)) {
    @chmod($produtosFile, 0666);
}

if (!file_exists($pedidosFile)) {
    file_put_contents($pedidosFile, '[]');
    @chmod($pedidosFile, 0666);
} else if (!is_writable($pedidosFile)) {
    @chmod($pedidosFile, 0666);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ==========================================
// FUNÇÕES AUXILIARES DE E-MAIL
// ==========================================

function enviarEmailNotificacao($pedido) {
    $emailAdmin = 'contato@ayurvedica.org';
    $assuntoAdmin = "[NOVO PEDIDO #" . $pedido['id'] . "] " . $pedido['product']['title'] . " - " . $pedido['customer']['name'];
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: ALBA Loja <noreply@ayurvedica.org>\r\n";
    $headers .= "Reply-To: " . $pedido['customer']['email'] . "\r\n";
    
    $tipoProdutoLabel = ($pedido['product']['type'] === 'digital') ? 'Digital (Acesso Online / Drive)' : 'Físico (Entrega via Correios / Transportadora)';
    
    $enderecoHtml = "";
    if ($pedido['product']['type'] === 'fisico' && !empty($pedido['customer']['address'])) {
        $addr = $pedido['customer']['address'];
        $enderecoHtml = "
        <div style='background: #fdf8f6; border: 1px solid #fbd5c8; border-radius: 8px; padding: 15px; margin-top: 15px;'>
            <h3 style='color: #c2410c; margin-top: 0;'>📦 DADOS PARA ENVIO / DESPACHO</h3>
            <p style='margin: 4px 0;'><strong>Destinatário:</strong> {$pedido['customer']['name']}</p>
            <p style='margin: 4px 0;'><strong>Endereço:</strong> {$addr['street']}, {$addr['number']}" . (!empty($addr['complement']) ? " - " . $addr['complement'] : "") . "</p>
            <p style='margin: 4px 0;'><strong>Bairro:</strong> {$addr['neighborhood']}</p>
            <p style='margin: 4px 0;'><strong>Cidade/UF:</strong> {$addr['city']} - {$addr['state']}</p>
            <p style='margin: 4px 0;'><strong>CEP:</strong> {$addr['cep']}</p>
        </div>";
    }

    $linkDigitalAdmin = "";
    if ($pedido['product']['type'] === 'digital' && !empty($pedido['product']['digitalUrl'])) {
        $linkDigitalAdmin = "<p style='margin: 4px 0;'><strong>Link do Google Drive:</strong> <a href='{$pedido['product']['digitalUrl']}' target='_blank'>{$pedido['product']['digitalUrl']}</a></p>";
    }

    $metodoPagamentoLabel = [
        'pix' => 'PIX (Chave Instantânea)',
        'credit_card' => 'Cartão de Crédito' . (isset($pedido['payment']['installments']) ? " ({$pedido['payment']['installments']}x)" : ""),
        'debit_card' => 'Cartão de Débito'
    ][$pedido['payment']['method']] ?? $pedido['payment']['method'];

    $mensagemAdmin = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='utf-8'></head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #eaeaea;'>
            <div style='background: #065f46; color: #fff; padding: 24px; text-align: center;'>
                <h1 style='margin: 0; font-size: 24px; font-weight: normal;'>Nova Venda Realizada!</h1>
                <p style='margin: 5px 0 0; opacity: 0.9; font-size: 14px;'>Pedido #{$pedido['id']} • ALBA Loja</p>
            </div>
            
            <div style='padding: 24px;'>
                <h3 style='color: #065f46; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 0;'>Detalhes do Produto</h3>
                <p style='margin: 4px 0; font-size: 16px;'><strong>Produto:</strong> {$pedido['product']['title']}</p>
                <p style='margin: 4px 0;'><strong>Tipo:</strong> {$tipoProdutoLabel}</p>
                <p style='margin: 4px 0;'><strong>Valor:</strong> <span style='color: #047857; font-weight: bold; font-size: 16px;'>{$pedido['product']['price']}</span></p>
                <p style='margin: 4px 0;'><strong>Forma de Pagamento:</strong> {$metodoPagamentoLabel}</p>
                <p style='margin: 4px 0;'><strong>Status:</strong> <span style='background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 4px; font-weight: bold;'>{$pedido['status']}</span></p>
                {$linkDigitalAdmin}

                <h3 style='color: #065f46; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;'>Dados do Comprador</h3>
                <p style='margin: 4px 0;'><strong>Nome:</strong> {$pedido['customer']['name']}</p>
                <p style='margin: 4px 0;'><strong>CPF:</strong> {$pedido['customer']['cpf']}</p>
                <p style='margin: 4px 0;'><strong>E-mail:</strong> <a href='mailto:{$pedido['customer']['email']}'>{$pedido['customer']['email']}</a></p>
                <p style='margin: 4px 0;'><strong>Telefone / WhatsApp:</strong> <a href='https://wa.me/55" . preg_replace('/\D/', '', $pedido['customer']['phone']) . "' target='_blank'>{$pedido['customer']['phone']}</a></p>

                {$enderecoHtml}
                
                <div style='margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;'>
                    <a href='https://ayurvedica.org/admin/loja' style='background: #065f46; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Acessar Painel de Pedidos</a>
                </div>
            </div>
        </div>
    </body>
    </html>";

    // Enviar e-mail para admin
    @mail($emailAdmin, $assuntoAdmin, $mensagemAdmin, $headers);

    // ==========================================
    // E-MAIL DE CONFIRMAÇÃO PARA O CLIENTE
    // ==========================================
    $emailCliente = $pedido['customer']['email'];
    $assuntoCliente = "Confirmação do Pedido #" . $pedido['id'] . " - ALBA";
    
    $headersCliente = "MIME-Version: 1.0\r\n";
    $headersCliente .= "Content-type: text/html; charset=utf-8\r\n";
    $headersCliente .= "From: Associação Luso-Brasileira de Ayurveda <contato@ayurvedica.org>\r\n";

    $areaAcessoCliente = "";
    if ($pedido['product']['type'] === 'digital' && !empty($pedido['product']['digitalUrl'])) {
        $areaAcessoCliente = "
        <div style='background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;'>
            <h3 style='color: #065f46; margin-top: 0;'>🎉 Seu Acesso Digital Está Liberado!</h3>
            <p style='margin: 8px 0 16px; color: #047857;'>Clique no botão abaixo para acessar seus materiais no Google Drive:</p>
            <a href='{$pedido['product']['digitalUrl']}' target='_blank' style='background: #059669; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;'>Acessar Produto no Google Drive</a>
            <p style='font-size: 12px; color: #6b7280; margin-top: 12px;'>Guarde este e-mail para acessar o material sempre que precisar.</p>
        </div>";
    } else if ($pedido['product']['type'] === 'fisico') {
        $areaAcessoCliente = "
        <div style='background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;'>
            <h3 style='color: #166534; margin-top: 0;'>🚚 Preparando o seu Envio</h3>
            <p style='margin: 4px 0; color: #374151;'>Recebemos seu pedido com sucesso e nossa equipe já está separando o seu produto para envio.</p>
            <p style='margin: 4px 0; color: #374151;'>Assim que o pacote for postado, você receberá o código de rastreamento por aqui.</p>
        </div>";
    }

    $mensagemCliente = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='utf-8'></head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #eaeaea;'>
            <div style='background: #065f46; color: #fff; padding: 24px; text-align: center;'>
                <h1 style='margin: 0; font-size: 24px; font-weight: normal;'>Obrigado pela sua compra!</h1>
                <p style='margin: 5px 0 0; opacity: 0.9; font-size: 14px;'>Associação Luso-Brasileira de Ayurveda (ALBA)</p>
            </div>
            
            <div style='padding: 24px;'>
                <p>Olá, <strong>{$pedido['customer']['name']}</strong>!</p>
                <p>Confirmamos o recebimento do seu pedido <strong>#{$pedido['id']}</strong> realizado em " . date('d/m/Y \à\s H:i') . ".</p>
                
                {$areaAcessoCliente}

                <h3 style='color: #065f46; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;'>Resumo do Pedido</h3>
                <p style='margin: 4px 0;'><strong>Item:</strong> {$pedido['product']['title']}</p>
                <p style='margin: 4px 0;'><strong>Valor Total:</strong> {$pedido['product']['price']}</p>
                <p style='margin: 4px 0;'><strong>Forma de Pagamento:</strong> {$metodoPagamentoLabel}</p>

                <div style='margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; font-size: 13px; color: #6b7280; text-align: center;'>
                    Em caso de dúvidas, responda a este e-mail ou fale conosco pelo WhatsApp institucional da ALBA.
                </div>
            </div>
        </div>
    </body>
    </html>";

    if (!empty($emailCliente)) {
        @mail($emailCliente, $assuntoCliente, $mensagemCliente, $headersCliente);
    }
}

// ==========================================
// ROTAS GET
// ==========================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Listar Produtos
    if ($action === 'products' || empty($action)) {
        $data = file_get_contents($produtosFile);
        if ($data === false || trim($data) === '') {
            echo '[]';
        } else {
            echo $data;
        }
        exit;
    }

    // 2. Listar Pedidos
    if ($action === 'orders') {
        $data = file_get_contents($pedidosFile);
        if ($data === false || trim($data) === '') {
            echo '[]';
        } else {
            echo $data;
        }
        exit;
    }
}

// ==========================================
// ROTAS POST
// ==========================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $body = json_decode($input, true);

    // 1. Salvar lista de produtos (Admin)
    if ($action === 'save_products') {
        if (!is_array($body)) {
            http_response_code(400);
            echo json_encode(['error' => 'Array de produtos inválido']);
            exit;
        }
        $result = file_put_contents($produtosFile, json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        if ($result === false) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salvar produtos no servidor.']);
            exit;
        }
        echo json_encode(['success' => true, 'count' => count($body)]);
        exit;
    }

    // 2. Criar novo Pedido (Checkout do Cliente)
    if ($action === 'create_order') {
        if (!$body || empty($body['customer']) || empty($body['product'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Dados de pedido incompletos']);
            exit;
        }

        $pedidos = [];
        if (file_exists($pedidosFile)) {
            $currentData = file_get_contents($pedidosFile);
            $pedidos = json_decode($currentData, true);
            if (!is_array($pedidos)) $pedidos = [];
        }

        // Gerar ID de Pedido amigável
        $orderId = 'PED-' . date('Y') . '-' . str_pad(strval(rand(1000, 9999)), 4, '0', STR_PAD_LEFT);
        
        $novoPedido = [
            'id' => $orderId,
            'createdAt' => date('c'),
            'status' => 'Concluído', // Produto digital / compra confirmada
            'customer' => [
                'name' => trim($body['customer']['name'] ?? ''),
                'cpf' => trim($body['customer']['cpf'] ?? ''),
                'email' => trim($body['customer']['email'] ?? ''),
                'phone' => trim($body['customer']['phone'] ?? ''),
                'address' => $body['customer']['address'] ?? null
            ],
            'product' => [
                'id' => $body['product']['id'] ?? '',
                'title' => $body['product']['title'] ?? '',
                'category' => $body['product']['category'] ?? '',
                'type' => $body['product']['type'] ?? 'digital',
                'price' => $body['product']['price'] ?? '',
                'digitalUrl' => $body['product']['digitalUrl'] ?? ''
            ],
            'payment' => [
                'method' => $body['payment']['method'] ?? 'pix',
                'installments' => $body['payment']['installments'] ?? 1,
                'cardLastDigits' => $body['payment']['cardLastDigits'] ?? null,
                'status' => 'Aprovado'
            ],
            'trackingCode' => '',
            'notes' => ''
        ];

        // Se for produto físico, status inicial é 'Pago' / aguardando despacho
        if ($novoPedido['product']['type'] === 'fisico') {
            $novoPedido['status'] = 'Pago';
        }

        // Adicionar ao início da lista de pedidos
        array_unshift($pedidos, $novoPedido);
        file_put_contents($pedidosFile, json_encode($pedidos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // Disparar e-mails de notificação
        try {
            enviarEmailNotificacao($novoPedido);
        } catch (Exception $e) {
            // Não quebra a resposta se o envio de e-mail falhar
        }

        echo json_encode([
            'success' => true,
            'order' => $novoPedido
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. Atualizar Status ou Rastreio de Pedido (Admin)
    if ($action === 'update_order_status') {
        if (empty($body['orderId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do pedido obrigatório']);
            exit;
        }

        $pedidos = [];
        if (file_exists($pedidosFile)) {
            $currentData = file_get_contents($pedidosFile);
            $pedidos = json_decode($currentData, true);
            if (!is_array($pedidos)) $pedidos = [];
        }

        $orderFound = false;
        foreach ($pedidos as &$p) {
            if ($p['id'] === $body['orderId']) {
                if (isset($body['status'])) $p['status'] = $body['status'];
                if (isset($body['trackingCode'])) $p['trackingCode'] = $body['trackingCode'];
                if (isset($body['notes'])) $p['notes'] = $body['notes'];
                $orderFound = true;
                break;
            }
        }

        if ($orderFound) {
            file_put_contents($pedidosFile, json_encode($pedidos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pedido não encontrado']);
        }
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
