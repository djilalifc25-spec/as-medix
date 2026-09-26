import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hb = 13.5,
      rbc = 4.5,
      wbc = 7.5,
      neut = 4.5,
      lymph = 2.2,
      eo = 0.2,
      baso = 0.05,
      mono = 0.5,
      plt = 250,
      vgm = 88,
      tcmh = 30,
      ccmh = 34,
      retic = 60,
      sex = 'h',
      pregnancy = false,
    } = body;

    // Normal Ranges
    const hbMin = sex === 'f' ? (pregnancy ? 10.5 : 12.0) : 13.0;
    const hbMax = sex === 'f' ? 15.5 : 17.5;
    const pltMin = 150;
    const pltMax = 400;
    const wbcMin = 4.0;
    const wbcMax = 10.0;
    const neutMin = 1.5;
    const neutMax = 7.0;
    const vgmMin = 80;
    const vgmMax = 100;

    const findings: { name: string; value: string; status: 'high' | 'low' | 'normal'; details: string }[] = [];

    // Hgb check
    if (hb < hbMin) {
      findings.push({
        name: 'Hémoglobine (Hb)',
        value: `${hb} g/dL`,
        status: 'low',
        details: `Anémie ${hb < 8 ? 'Sévère (< 8 g/dL)' : hb < 10 ? 'Modérée (8-10 g/dL)' : 'Légère (10-12 g/dL)'}`
      });
    } else if (hb > hbMax) {
      findings.push({
        name: 'Hémoglobine (Hb)',
        value: `${hb} g/dL`,
        status: 'high',
        details: 'Polyglobulie (Élévement de la masse érythrocytaire)'
      });
    } else {
      findings.push({ name: 'Hémoglobine (Hb)', value: `${hb} g/dL`, status: 'normal', details: 'Dans les normes usuelles' });
    }

    // VGM check
    if (vgm < vgmMin) {
      findings.push({ name: 'VGM', value: `${vgm} fL`, status: 'low', details: 'Microcytose (Volume Globulaire Moyen < 80 fL)' });
    } else if (vgm > vgmMax) {
      findings.push({ name: 'VGM', value: `${vgm} fL`, status: 'high', details: 'Macrocytose (Volume Globulaire Moyen > 100 fL)' });
    } else {
      findings.push({ name: 'VGM', value: `${vgm} fL`, status: 'normal', details: 'Normocytose (80 - 100 fL)' });
    }

    // Leucocytes check
    if (wbc < wbcMin) {
      findings.push({ name: 'Leucocytes Total', value: `${wbc} G/L`, status: 'low', details: 'Leucopénie (< 4.0 G/L)' });
    } else if (wbc > wbcMax) {
      findings.push({ name: 'Leucocytes Total', value: `${wbc} G/L`, status: 'high', details: 'Hyperleucocytose (> 10.0 G/L)' });
    } else {
      findings.push({ name: 'Leucocytes Total', value: `${wbc} G/L`, status: 'normal', details: 'Normal (4.0 - 10.0 G/L)' });
    }

    // Neutrophils check
    if (neut < 0.5) {
      findings.push({ name: 'Polynucléaires Neutrophiles', value: `${neut} G/L`, status: 'low', details: '🔴 AGRANULOCYTOSE (PNN < 0.5 G/L - Urgence Médicale Formelle !)' });
    } else if (neut < neutMin) {
      findings.push({ name: 'Polynucléaires Neutrophiles', value: `${neut} G/L`, status: 'low', details: 'Neutropénie (< 1.5 G/L)' });
    } else if (neut > neutMax) {
      findings.push({ name: 'Polynucléaires Neutrophiles', value: `${neut} G/L`, status: 'high', details: 'Polynucléose Neutrophile (> 7.0 G/L)' });
    } else {
      findings.push({ name: 'Polynucléaires Neutrophiles', value: `${neut} G/L`, status: 'normal', details: 'Normal (1.5 - 7.0 G/L)' });
    }

    // Platelets check
    if (plt < 20) {
      findings.push({ name: 'Plaquettes', value: `${plt} G/L`, status: 'low', details: '🔴 THROMBOPÉNIE SÉVÈRE (< 20 G/L - Risque Hémorragique Majeur !)' });
    } else if (plt < pltMin) {
      findings.push({ name: 'Plaquettes', value: `${plt} G/L`, status: 'low', details: 'Thrombopénie (< 150 G/L)' });
    } else if (plt > pltMax) {
      findings.push({ name: 'Plaquettes', value: `${plt} G/L`, status: 'high', details: 'Hyperplaquettose / Thrombocytose (> 400 G/L)' });
    } else {
      findings.push({ name: 'Plaquettes', value: `${plt} G/L`, status: 'normal', details: 'Normal (150 - 400 G/L)' });
    }

    // Diagnostic Hypotheses Logic
    const diagnoses: { title: string; probability: string; description: string; alert: 'danger' | 'warning' | 'info' | 'success' }[] = [];

    if (neut < 0.5) {
      diagnoses.push({
        title: 'Agranulocytose Médicamenteuse ou Toxique Aiguë',
        probability: '95%',
        description: 'PNN < 500 /mm³. Urgence vitale absolue. Nécessite l\'isolement protecteur en chambre stérile, l\'arrêt immédiat des médicaments suspects et l\'antibiothérapie à large spectre si fièvre.',
        alert: 'danger'
      });
    }

    if (hb < hbMin) {
      if (vgm < 80) {
        if (retic > 120) {
          diagnoses.push({
            title: 'Anémie Microcytaire Régénérative (Hémorragie récente ou Thassalémie)',
            probability: '85%',
            description: 'Microcytose avec réticulocytose élevée. Évoque une spoliation sanguine récente ou une anémie hémolytique.',
            alert: 'warning'
          });
        } else {
          diagnoses.push({
            title: 'Anémie Microcytaire Arégénérative (Carence Martiale ou Anémie Inflammatoire)',
            probability: '90%',
            description: 'Microcytose (VGM < 80 fL) sans régénération réticulocytaire. Bilan de 1ère intention : Ferritinémie, CRP, Coefficient de saturation de la transferrine (CST).',
            alert: 'warning'
          });
        }
      } else if (vgm > 100) {
        diagnoses.push({
          title: 'Anémie Macrocytaire (Carence B12/B9, Alcoolisme, Hypothyroïdie)',
          probability: '88%',
          description: 'Macrocytose (VGM > 100 fL). Dosages systématiques : Vitamine B12 sérique, Folates sériques (B9), TSH et bilan hépatique GGT/VGM.',
          alert: 'warning'
        });
      } else {
        diagnoses.push({
          title: 'Anémie Normocytaire Normochrome',
          probability: '80%',
          description: 'VGM préservé (80-100 fL). Vérifier les réticulocytes : Si > 120 G/L = Hémolyse ou Hémorragie. Si < 120 G/L = Insuffisance rénale (déficit EPO) ou envahissement médullaire.',
          alert: 'info'
        });
      }
    }

    if (wbc > 10.0 && neut > 7.0) {
      diagnoses.push({
        title: 'Syndrome Inflammatoire / Infection Bactérienne Aiguë',
        probability: '85%',
        description: 'Polynucléose neutrophile réactive. À confronter avec CRP, Procalcitonine et foyer infectieux clinique.',
        alert: 'info'
      });
    }

    if (wbc > 10.0 && lymph > 4.0) {
      diagnoses.push({
        title: 'Hyperlymphocytose (Syndrome Mononucléosique ou Hémopathie)',
        probability: '82%',
        description: 'Augmentation des lymphocytes. Évoque une infection virale (MNI / MNI-like, MNI-MNI, CMV, VIH) ou une LLC si sujet âgé.',
        alert: 'info'
      });
    }

    if (plt < 150 && plt >= 20) {
      diagnoses.push({
        title: 'Thrombopénie Modérée (PTI, Médicamenteuse, Hypersplénisme)',
        probability: '78%',
        description: 'Contrôler la numération sur tube Citrate pour éliminer une EDTA-Agglutination (Fausse thrombopénie).',
        alert: 'warning'
      });
    }

    if (hb > hbMax) {
      diagnoses.push({
        title: 'Polyglobulie (Maladie de Vaquez vs Polyglobulie Secondaire)',
        probability: '85%',
        description: 'Élévation de l\'Hémoglobine et de l\'Hématocrite. Mesurer l\'Érythropoïétine (EPO) sérique et rechercher la mutation JAK2 V617F.',
        alert: 'warning'
      });
    }

    if (diagnoses.length === 0) {
      diagnoses.push({
        title: 'Formule Numérique Sanguine (FNS) Physiologique',
        probability: '99%',
        description: 'Toutes les lignes hématologiques (Hémoglobine, Leucocytes, Plaquettes et Indices Érythrocytaires) sont strictement dans les normes de référence.',
        alert: 'success'
      });
    }

    // Recommendations
    const recommendations = [
      'Confronter l\'interprétation FNS avec le contexte clinique (fièvre, syndrome hémorragique, asthénie, prise médicamenteuse récente).',
      'En cas d\'anémie : prescrire systématiquement le dosage de la Ferritinémie et de la CRP.',
      'En cas d\'anomalie de la lignée blanche ou plaquettaire : réaliser un Frottis Sanguin avec étude cytologique du frottis de sang périphérique.',
      'Toute neutropénie < 500/mm³ avec fièvre nécessite une hospitalisation en urgence et une prise en charge en secteur stérile.'
    ];

    return NextResponse.json({
      success: true,
      findings,
      diagnoses,
      recommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
