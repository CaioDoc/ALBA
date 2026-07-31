const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('./data/cursos.js', 'utf8');
const match = content.match(/export const initialCourses = (\[[\s\S]*\]);/);
const courses = JSON.parse(match[1]);

console.log('Total Cursos:', courses.length);
courses.forEach(c => {
  const fileExists = c.image.startsWith('http') ? 'URL' : fs.existsSync(path.join('.', 'public', c.image));
  console.log(`ID: ${c.id} | Title: ${c.title.substring(0, 35)} | Image: ${c.image} | FileExists: ${fileExists}`);
});
