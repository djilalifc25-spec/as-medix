const { extractMetadataFromHtml } = require('../lib/autoHtmlFormatter');

const sampleHtml1 = `
<h1 class="text-3xl font-black">La Pneumopathie Franche Lobaire Aiguë (PFLA)</h1>
<h2 class="subtitle">Diagnostic clinique, microbiologie (Pneumocoque) et antibiothérapie probabiliste</h2>
<p class="description">La PFLA est une infection parenchymateuse pulmonaire aiguë d'origine bactérienne, caractérisée par une condensation alvéolaire fibrineuse homogène non rétractile.</p>
<p>Signes fonctionnels: début brutal par un frisson solennel, fièvre à 40°C, douleur thoracique vive en coup de poignard.</p>
`;

const meta1 = extractMetadataFromHtml(sampleHtml1);
console.log("=== TEST HTML 1 ===");
console.log("Title:", meta1.title);
console.log("Subtitle:", meta1.subtitle);
console.log("Description:", meta1.description);

const sampleHtml2 = `
<section id="sec-1">
  <h2>1. Rétrécissement Mitral (RM)</h2>
  <p>Le rétrécissement mitral est un obstacle au remplissage du ventricule gauche lié à un épaississement et une fusion des commissures valvulaires mitrales. Il est quasi exclusivement d'origine rhumatismale (RAA).</p>
</section>
`;

const meta2 = extractMetadataFromHtml(sampleHtml2);
console.log("\n=== TEST HTML 2 ===");
console.log("Title:", meta2.title);
console.log("Subtitle:", meta2.subtitle);
console.log("Description:", meta2.description);
