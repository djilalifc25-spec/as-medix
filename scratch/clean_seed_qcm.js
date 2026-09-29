const fs = require('fs');
let txt = fs.readFileSync('./lib/db/seedQcm.ts', 'utf8');

const exportDecl = 'export const INITIAL_QCMS: QCM[] = ';
const exportPos = txt.indexOf(exportDecl);

if (exportPos !== -1) {
  let jsonStr = txt.substring(exportPos + exportDecl.length).trim().replace(/;\s*$/, '');
  jsonStr = jsonStr.replace(/,\s*\]/g, ']');
  const items = JSON.parse(jsonStr);
  const filtered = items.filter(q => q.specialtyId !== 'cardio');
  console.log(`Seed QCMs count before: ${items.length}, after: ${filtered.length}`);
  const newContent = txt.substring(0, exportPos + exportDecl.length) + JSON.stringify(filtered, null, 2) + ';\n';
  fs.writeFileSync('./lib/db/seedQcm.ts', newContent, 'utf8');
  console.log('Successfully updated seedQcm.ts!');
}
