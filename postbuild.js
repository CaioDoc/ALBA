const fs = require('fs');
const path = require('path');

// 1. Criar o arquivo .htaccess na pasta out/
const htaccessContent = `# Habilitar Reescritas de URL
RewriteEngine On
RewriteBase /

# Redirecionar /pagina para /pagina/ (trailing slash) para manter as URLs limpas e evitar 404
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ /$1/ [L,R=301]

# Servir index.html de subpastas automaticamente
DirectoryIndex index.html

# Configuração de Cache para arquivos estáticos (Melhoria de Performance)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType application/json "access plus 0 seconds"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
`;

try {
  fs.writeFileSync(path.join(__dirname, 'out', '.htaccess'), htaccessContent);
  console.log('✓ Arquivo .htaccess gerado com sucesso em out/.htaccess');
} catch (err) {
  console.error('Erro ao gerar o .htaccess:', err);
}

// 2. Copiar a pasta backend para out/api
const sourceDir = path.join(__dirname, 'backend');
const destDir = path.join(__dirname, 'out', 'api');

try {
  if (fs.existsSync(sourceDir)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      // Copiar apenas arquivos relevantes
      if (file.endsWith('.php') || file.endsWith('.sql') || file.endsWith('.json')) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
        console.log(`✓ Copiado: ${file} -> out/api/${file}`);
      }
    });
    console.log('✓ Pasta backend copiada para out/api com sucesso.');
  } else {
    console.log('Aviso: Pasta backend não encontrada para copiar.');
  }
} catch (err) {
  console.error('Erro ao copiar a pasta backend:', err);
}
