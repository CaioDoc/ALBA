const fs = require('fs');
const { parse } = require('csv-parse/sync');

const inputFiles = ['F:\\Antigravity\\Alba\\wp_posts.csv', 'F:\\Antigravity\\Alba\\wp_posts (1).csv'];

let allArticles = [];

for (const file of inputFiles) {
  try {
    const fileContent = fs.readFileSync(file, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      escape: '\\'
    });

    for (const row of records) {
      if (row.post_type === 'post' && row.post_status === 'publish') {
        const id = parseInt(row.ID || row.id);
        const title = row.post_title || 'Sem Titulo';
        const date = new Date(row.post_date).toLocaleDateString('pt-BR');
        let conteudo = row.post_content || '';
        
        // Try to generate a plain text summary from HTML content
        let resumo = conteudo.replace(/<[^>]+>/g, '').substring(0, 120).trim() + '...';

        // Add to list
        allArticles.push({
          id: id,
          title: title,
          author: 'Admin',
          status: 'Publicado',
          date: date,
          conteudo: conteudo,
          resumo: resumo,
          imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
          tag: 'Geral'
        });
      }
    }
    console.log(`Parsed ${records.length} total rows from ${file}. Valid published posts: ${allArticles.length}`);
  } catch (err) {
    console.error(`Error parsing ${file}:`, err.message);
  }
}

// Remove duplicates by ID
const uniqueArticlesMap = new Map();
allArticles.forEach(a => uniqueArticlesMap.set(a.id, a));
const uniqueArticles = Array.from(uniqueArticlesMap.values());

fs.writeFileSync('F:\\Antigravity\\Alba\\ALBA\\data\\artigos-importados.json', JSON.stringify(uniqueArticles, null, 2));

console.log(`Successfully exported ${uniqueArticles.length} unique articles to artigos-importados.json`);
