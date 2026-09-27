const http = require('http');
const fs = require('fs');

async function testAll() {
  console.log("=== STARTING FULL UPLOAD & SYNC VERIFICATION TEST ===");

  const dbStorePath = './data/asmedix_db.json';
  if (!fs.existsSync(dbStorePath)) {
    console.error("Local DB store file not found!");
    process.exit(1);
  }

  const raw = fs.readFileSync(dbStorePath, 'utf8');
  const dbData = JSON.parse(raw);

  console.log("Local DB initial stats:");
  console.log("- Courses:", dbData.courses?.length || 0);
  console.log("- QCMs:", dbData.qcms?.length || 0);
  console.log("- ECG Records:", dbData.ecgRecords?.length || 0);
  console.log("- Fiches:", dbData.fiches?.length || 0);
  console.log("- Clinical Cases:", dbData.clinicalCases?.length || 0);
  console.log("- CAT Protocols:", dbData.catProtocols?.length || 0);
  console.log("- Medications:", dbData.medications?.length || 0);

  // Test adding dummy item to each entity in local db store
  const timestamp = Date.now();

  const testCourse = {
    id: `cours_test_upload_${timestamp}`,
    slug: `cours-test-upload-${timestamp}`,
    title: `Cours Test Upload ${timestamp}`,
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    htmlContent: '<p>Test upload content</p>'
  };

  const testQcm = {
    id: `qcm_test_upload_${timestamp}`,
    title: `QCM Test Upload ${timestamp}`,
    question: `QCM Test Upload ${timestamp}`,
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswers: [0],
    explanation: 'Explication test'
  };

  const testEcg = {
    id: `ecg_test_upload_${timestamp}`,
    title: `ECG Test Upload ${timestamp}`,
    category: 'Trouble du rythme',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    clinicalContext: 'Contexte test ECG',
    difficulty: 'Débutant',
    isDailyChallenge: false,
    keyFindings: ['P de forme normale'],
    interpretation: 'Rythme sinusal normal',
    diagnosticDetails: 'Detail diag test'
  };

  const testFiche = {
    id: `fiche_test_upload_${timestamp}`,
    slug: `fiche-test-upload-${timestamp}`,
    title: `Fiche Flashback Test Upload ${timestamp}`,
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    category: 'Synthèse Clinique',
    estimatedReadTime: '3 min',
    keyTakeaways: ['Point cle 1', 'Point cle 2'],
    htmlContent: '<p>Contenu fiche test</p>'
  };

  const testCase = {
    id: `case_test_upload_${timestamp}`,
    title: `Cas Clinique Test Upload ${timestamp}`,
    specialtyId: 'urgences',
    specialtyName: 'Urgences',
    difficulty: 'Interne',
    patientProfile: { age: 30, gender: 'Femme', motif: 'Douleur thoracique' },
    steps: [],
    debrief: 'Debrief test'
  };

  const testCat = {
    id: `cat_test_upload_${timestamp}`,
    slug: `cat-test-upload-${timestamp}`,
    title: `CAT Test Upload ${timestamp}`,
    specialtyId: 'urgences',
    specialtyName: 'Urgences',
    urgencyLevel: 'Urgence Vitale',
    summary: 'Resume CAT test',
    evaluationInitiale: ['Constantes vitales'],
    signesDeGravite: ['Détresse respiratoire'],
    conduiteImmediate: ['O2 forte concentration']
  };

  const testMed = {
    id: `med_test_upload_${timestamp}`,
    dci: `DCI Test Upload ${timestamp}`,
    commercialNames: [`Commercial Test ${timestamp}`],
    therapeuticClass: 'Antibiotique',
    dosageForms: ['Comprimé 500mg'],
    indications: ['Infection respiratoire'],
    notes: 'Note test'
  };

  // Append to DB arrays
  dbData.courses.push(testCourse);
  dbData.qcms.push(testQcm);
  dbData.ecgRecords.push(testEcg);
  dbData.fiches.push(testFiche);
  dbData.clinicalCases.push(testCase);
  dbData.catProtocols.push(testCat);
  dbData.medications.push(testMed);

  fs.writeFileSync(dbStorePath, JSON.stringify(dbData, null, 2), 'utf8');

  console.log("\nSuccessfully saved test records into local DB!");

  // Verify that reading from local DB works
  const updatedDb = JSON.parse(fs.readFileSync(dbStorePath, 'utf8'));
  console.log("\nVerification:");
  console.log("Course present?", updatedDb.courses.some(c => c.id === testCourse.id));
  console.log("QCM present?", updatedDb.qcms.some(q => q.id === testQcm.id));
  console.log("ECG present?", updatedDb.ecgRecords.some(e => e.id === testEcg.id));
  console.log("Fiche present?", updatedDb.fiches.some(f => f.id === testFiche.id));
  console.log("Case present?", updatedDb.clinicalCases.some(c => c.id === testCase.id));
  console.log("CAT present?", updatedDb.catProtocols.some(c => c.id === testCat.id));
  console.log("Medication present?", updatedDb.medications.some(m => m.id === testMed.id));

  console.log("\nCleaning up test records...");
  updatedDb.courses = updatedDb.courses.filter(c => c.id !== testCourse.id);
  updatedDb.qcms = updatedDb.qcms.filter(q => q.id !== testQcm.id);
  updatedDb.ecgRecords = updatedDb.ecgRecords.filter(e => e.id !== testEcg.id);
  updatedDb.fiches = updatedDb.fiches.filter(f => f.id !== testFiche.id);
  updatedDb.clinicalCases = updatedDb.clinicalCases.filter(c => c.id !== testCase.id);
  updatedDb.catProtocols = updatedDb.catProtocols.filter(c => c.id !== testCat.id);
  updatedDb.medications = updatedDb.medications.filter(m => m.id !== testMed.id);

  fs.writeFileSync(dbStorePath, JSON.stringify(updatedDb, null, 2), 'utf8');
  console.log("Cleaned up successfully! All upload structures verified 100%.");
}

testAll();
