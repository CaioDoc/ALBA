import fs from 'fs';

const urls = [
  "https://www.ayurvedica.org/aprofundamento-em-yoga-yogaterapia/",
  "https://www.ayurvedica.org/iniciacao-pratica-asanas/",
  "https://www.ayurvedica.org/instrutor-de-yoga-nivel-tecnico/",
  "https://www.ayurvedica.org/yoga-para-desportistas-workshop/",
  "https://www.ayurvedica.org/yoga-para-idosos/",
  "https://www.ayurvedica.org/plantas-yoga-workshop/",
  "https://www.ayurvedica.org/meditacao-infantil-workshop/",
  "https://www.ayurvedica.org/tantrismo-vedanta-e-sanquia/",
  "https://www.ayurvedica.org/yoga-infantil-workshop/",
  "https://www.ayurvedica.org/yoga-hormonal/",
  "https://www.ayurvedica.org/massagem-ayurvedica-tradicional/",
  "https://www.ayurvedica.org/massagem-ayurvedica-para-spa-terapias/",
  "https://www.ayurvedica.org/indian-head-massage-champi/",
  "https://www.ayurvedica.org/nutricao-ayurvedica-estilo-de-vida/",
  "https://www.ayurvedica.org/naturopatia-ayurvedica/",
  "https://www.ayurvedica.org/cristais-e-meditacao/",
  "https://www.ayurvedica.org/mapa-astral-e-o-proposito-de-vida-pessoal/"
];

const categories = {
  "https://www.ayurvedica.org/aprofundamento-em-yoga-yogaterapia/": "Yoga",
  "https://www.ayurvedica.org/iniciacao-pratica-asanas/": "Yoga",
  "https://www.ayurvedica.org/instrutor-de-yoga-nivel-tecnico/": "Yoga",
  "https://www.ayurvedica.org/yoga-para-desportistas-workshop/": "Yoga",
  "https://www.ayurvedica.org/yoga-para-idosos/": "Yoga",
  "https://www.ayurvedica.org/plantas-yoga-workshop/": "Yoga",
  "https://www.ayurvedica.org/meditacao-infantil-workshop/": "Yoga",
  "https://www.ayurvedica.org/tantrismo-vedanta-e-sanquia/": "Yoga",
  "https://www.ayurvedica.org/yoga-infantil-workshop/": "Yoga",
  "https://www.ayurvedica.org/yoga-hormonal/": "Yoga",
  "https://www.ayurvedica.org/massagem-ayurvedica-tradicional/": "Massagens Ayurvédicas",
  "https://www.ayurvedica.org/massagem-ayurvedica-para-spa-terapias/": "Massagens Ayurvédicas",
  "https://www.ayurvedica.org/indian-head-massage-champi/": "Massagens Ayurvédicas",
  "https://www.ayurvedica.org/nutricao-ayurvedica-estilo-de-vida/": "Medicina Ayurvédica",
  "https://www.ayurvedica.org/naturopatia-ayurvedica/": "Medicina Ayurvédica",
  "https://www.ayurvedica.org/cristais-e-meditacao/": "Estudos Holísticos",
  "https://www.ayurvedica.org/mapa-astral-e-o-proposito-de-vida-pessoal/": "Estudos Holísticos"
};

async function scrape() {
  const courses = [];
  let id = 1;
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      let title = titleMatch ? titleMatch[1] : "Sem Título";
      title = title.replace(/&#8211; ALBA.*/, '').trim();
      title = title.replace(/&amp;/g, '&').replace(/&#8211;/g, '-');
      
      const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i) || html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
      let description = descMatch ? descMatch[1] : "";
      
      const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
      let image = imgMatch ? imgMatch[1] : "";
      
      courses.push({
        id: id++,
        title: title,
        category: categories[url],
        workload: 'Consultar',
        format: 'Presencial / Online',
        status: 'Inscrições Abertas',
        students: 0,
        image: image,
        description: description,
        originalUrl: url
      });
      console.log("Scraped:", title);
    } catch(e) {
      console.error("Error scraping", url, e.message);
    }
  }
  
  const content = `export const scrapedCourses = ${JSON.stringify(courses, null, 2)};`;
  fs.writeFileSync('data/scraped_courses.js', content);
  console.log("Saved to data/scraped_courses.js");
}
scrape();
