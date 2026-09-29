const fs = require('fs');
let txt = fs.readFileSync('./lib/db/seedCourses.ts', 'utf8');

const exportDecl = 'export const INITIAL_COURSES: Course[] = ';
const exportPos = txt.indexOf(exportDecl);

if (exportPos !== -1) {
  let jsonStr = txt.substring(exportPos + exportDecl.length).trim().replace(/;\s*$/, '');
  while (jsonStr.includes(',,') || jsonStr.match(/,\s*,/) || jsonStr.match(/,\s*\]/)) {
    jsonStr = jsonStr.replace(/,\s*,/g, ',').replace(/,\s*\]/g, ']');
  }
  const items = JSON.parse(jsonStr);
  const filtered = items.filter(Boolean).filter(c => c && c.specialtyId !== 'cardio' && c.slug !== 'yyyy' && c.slug !== 'nononon' && c.slug !== 'hyh');
  console.log(`Seed Courses count before: ${items.length}, after: ${filtered.length}`);
  const newContent = txt.substring(0, exportPos + exportDecl.length) + JSON.stringify(filtered, null, 2) + ';\n';
  fs.writeFileSync('./lib/db/seedCourses.ts', newContent, 'utf8');
  console.log('Successfully updated seedCourses.ts!');
}
