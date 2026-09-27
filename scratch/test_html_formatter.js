const { autoFormatCourseHtml } = require('../lib/autoHtmlFormatter');

const sampleRawText = `
1. Introduction & Physiopathologie
La Pleurésie est une inflammation des feuillets de la plèvre.
💡 Perle Clinique: L'épanchement pleural exsudatif est caractérisé par un taux de protéines > 30 g/L.

2. Diagnostic Clinique
Le syndrome d'épanchement pleural liquide associe:
- Abolition des vibrations vocales
- Matité franche à la percussion
- Abolition du murmure vésiculaire

⚠️ Piège Résidanat: Ne jamais faire une ponction pleurale sous la 9ème côte au risque de léser les organes sous-diaphragmatiques!

3. Traitement & Prise en Charge
💊 Traitement Thérapeutique: Drainage pleural en urgence si détresse respiratoire ou empyème pleural.
`;

const result = autoFormatCourseHtml(sampleRawText);
console.log("=== TABLE OF CONTENTS GENERATED ===");
console.log(JSON.stringify(result.tableOfContents, null, 2));

console.log("\n=== BEAUTIFIED AS-MEDIX PRESENTATION HTML ===");
console.log(result.htmlContent);
