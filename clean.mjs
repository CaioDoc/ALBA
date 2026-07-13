import fs from 'fs';
import { scrapedCourses } from './data/scraped_courses.js';

const cleanCourses = scrapedCourses
  .filter(c => !c.title.includes("Página não encontrada"))
  .map(c => {
    let title = c.title.replace(/\s*\|\s*ALBA.*/i, '').trim();
    title = title.replace(/&#038;/g, '&');
    return {
      ...c,
      title: title,
      hotmartLink: c.originalUrl // We use originalUrl as the link for now
    };
  });

const content = `export const initialCourses = ${JSON.stringify(cleanCourses, null, 2)};`;
fs.writeFileSync('data/cursos.js', content);
console.log("Cleaned courses saved to data/cursos.js");
