const fs = require('fs');

const coursesText = fs.readFileSync('./lib/db/seedCourses.ts', 'utf8');
console.log('--- Seed Courses Cardio items ---');
const courseMatches = coursesText.match(/\{[^{}]*"specialtyId":\s*"cardio"[^{}]*\}/g);
if (courseMatches) {
  courseMatches.forEach(m => console.log(m));
} else {
  // Try regex matching objects
  const titleMatches = coursesText.match(/"title":\s*"([^"]+)"[^\}]*"specialtyId":\s*"cardio"/g);
  console.log(titleMatches);
}

// Extract all titles and specialtyIds from seedCourses
const titleRegex = /"title":\s*"([^"]+)"[\s\S]*?"specialtyId":\s*"([^"]+)"/g;
let match;
while ((match = titleRegex.exec(coursesText)) !== null) {
  if (match[2] === 'cardio') {
    console.log('Cardio course title:', match[1]);
  }
}

// Search for yyyy, nononon, hyh in seedCourses
['yyyy', 'nononon', 'hyh', 'Mitral', 'Insuffisance Cardiaque'].forEach(term => {
  const count = (coursesText.match(new RegExp(term, 'gi')) || []).length;
  console.log(`Term "${term}" occurrences in seedCourses.ts:`, count);
});
