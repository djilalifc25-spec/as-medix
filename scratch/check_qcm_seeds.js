const fs = require('fs');
const qcmText = fs.readFileSync('./lib/db/seedQcm.ts', 'utf8');

const cardioQcms = (qcmText.match(/"specialtyId":\s*"cardio"/g) || []).length;
console.log('Cardio QCMs count in seedQcm.ts:', cardioQcms);

// List cardio qcm titles/ids
const qcmRegex = /"id":\s*"([^"]+)"[\s\S]*?"specialtyId":\s*"cardio"/g;
let match;
while ((match = qcmRegex.exec(qcmText)) !== null) {
  console.log('Cardio QCM ID:', match[1]);
}
