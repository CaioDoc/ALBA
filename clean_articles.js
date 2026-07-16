const fs = require('fs');

const images = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop'
];

try {
  const data = JSON.parse(fs.readFileSync('F:\\Antigravity\\Alba\\ALBA\\data\\artigos-importados.json', 'utf8'));
  
  data.forEach((article, index) => {
    // Assign generic image
    article.imagem = images[index % images.length];

    // Remove WordPress shortcodes like [su_tabs ...], [/su_tabs], etc.
    const shortcodeRegex = /\[\/?su_[^\]]*\]/g;
    
    if (article.conteudo) {
      article.conteudo = article.conteudo.replace(shortcodeRegex, '');
    }
    if (article.resumo) {
      article.resumo = article.resumo.replace(shortcodeRegex, '');
    }
  });
  
  const tsContent = 'export const initialArticles = ' + JSON.stringify(data, null, 2) + ';';
  fs.writeFileSync('F:\\Antigravity\\Alba\\ALBA\\data\\artigos.ts', tsContent);
  console.log('Shortcodes removed, images assigned and artigos.ts updated.');
} catch (e) {
  console.error(e);
}
