'use client';

import React, { useState } from 'react';
import {
  Siren, Zap, Activity, Calculator, ShieldAlert, Heart, Flame,
  Clock, CheckCircle2, ArrowRight, Stethoscope, AlertTriangle,
  Droplet, Syringe, Biohazard, HeartPulse, RefreshCw, Thermometer,
  Shield, Check, Copy, Sparkles, FileText, Info
} from 'lucide-react';

export default function ModeGardePage() {
  const [activeTab, setActiveTab] = useState<'pedia' | 'gds' | 'pse' | 'toxico' | 'transfusion' | 'protocols' | 'customHtml'>('pedia');
  const [customProtocols, setCustomProtocols] = useState<any[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/garde')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.protocols && data.protocols.length > 0) {
          setCustomProtocols(data.protocols);
          setSelectedProtocolId(data.protocols[0].id);
        }
      })
      .catch(err => console.error('Error loading custom garde protocols:', err));
  }, []);

  // 1. Pediatric Dose Calculator State
  const [pediaWeight, setPediaWeight] = useState<number>(12);
  const [pediaAge, setPediaAge] = useState<number>(3);

  // 2. GDS & Anion Gap State
  const [gdsPh, setGdsPh] = useState<number>(7.32);
  const [gdsPaco2, setGdsPaco2] = useState<number>(30);
  const [gdsHco3, setGdsHco3] = useState<number>(15);
  const [gdsPao2, setGdsPao2] = useState<number>(75);
  const [gdsFio2, setGdsFio2] = useState<number>(21); // %
  const [gdsNa, setGdsNa] = useState<number>(138);
  const [gdsCl, setGdsCl] = useState<number>(102);
  const [gdsAlb, setGdsAlb] = useState<number>(40); // g/L

  // 3. PSE State (Pousse-Seringue Électrique)
  const [pseWeight, setPseWeight] = useState<number>(70);
  const [pseDrug, setPseDrug] = useState<'noradre' | 'adre' | 'dobutamine' | 'heparine'>('noradre');
  const [pseDoseTarget, setPseDoseTarget] = useState<number>(0.2); // µg/kg/min
  const [pseConcentration, setPseConcentration] = useState<number>(1); // mg/mL (ex: 50mg dans 50mL = 1mg/mL)

  // 4. Transfusion State
  const [transfusionWeight, setTransfusionWeight] = useState<number>(70);
  const [transfusionHbActual, setTransfusionHbActual] = useState<number>(6.5);
  const [transfusionHbTarget, setTransfusionHbTarget] = useState<number>(9.0);

  // 5. IV Drip Speed Calculator State
  const [dripVolume, setDripVolume] = useState<number>(500); // mL
  const [dripHours, setDripHours] = useState<number>(4); // hours

  // Copy Feedback State
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // --- CALCULATIONS ---
  // Pediatric doses:
  const paracetamolDose = (pediaWeight * 15).toFixed(0); // 15 mg/kg per dose
  const amoxicillineDose = (pediaWeight * 80).toFixed(0); // 80 mg/kg/j
  const solupredDose = (pediaWeight * 2).toFixed(0); // 2 mg/kg/j
  const adrenalineImDose = (pediaWeight * 0.01).toFixed(2); // 0.01 mg/kg
  const ringerBolusDose = (pediaWeight * 20).toFixed(0); // 20 mL/kg
  const valiumIrDose = (pediaWeight * 0.5).toFixed(1); // 0.5 mg/kg
  const ceftriaxonePediaDose = (pediaWeight * 100).toFixed(0); // 100 mg/kg/j
  const ettSize = ((pediaAge / 4) + 4).toFixed(1);
  const ngtSize = (pediaAge * 2 + 8);

  // GDS & Anion Gap Calculation:
  const anionGap = (gdsNa - (gdsCl + gdsHco3)).toFixed(1);
  const correctedAnionGap = (Number(anionGap) + 0.25 * (40 - gdsAlb)).toFixed(1);
  const paO2FiO2Ratio = Math.round((gdsPao2 / (gdsFio2 / 100)));

  const evaluateGds = () => {
    let diagnosis = '';
    let alertColor = 'emerald';

    if (gdsPh < 7.35) {
      if (gdsHco3 < 22 && gdsPaco2 < 38) {
        diagnosis = `Acidose Métabolique partiellement compensée (HCO3- bas, PaCO2 basse par hyperventilation). Trou Anionique = ${anionGap} mmol/L (Corrégé: ${correctedAnionGap}).`;
        alertColor = 'rose';
      } else if (gdsHco3 < 22) {
        diagnosis = `Acidose Métabolique pure (HCO3- bas = ${gdsHco3} mmol/L). Trou Anionique = ${anionGap} mmol/L.`;
        alertColor = 'rose';
      } else if (gdsPaco2 > 45) {
        diagnosis = `Acidose Respiratoire (PaCO2 élevée = ${gdsPaco2} mmHg, hypoventilation alvéolaire).`;
        alertColor = 'rose';
      } else {
        diagnosis = 'Acidose décompensée mixte';
        alertColor = 'rose';
      }
    } else if (gdsPh > 7.45) {
      if (gdsPaco2 < 35) {
        diagnosis = 'Alcalose Respiratoire (Hyperventilation, PaCO2 basse)';
        alertColor = 'amber';
      } else if (gdsHco3 > 26) {
        diagnosis = 'Alcalose Métabolique (HCO3- élevé)';
        alertColor = 'amber';
      } else {
        diagnosis = 'Alcalose mixte';
        alertColor = 'amber';
      }
    } else {
      diagnosis = 'pH dans les limites physiologiques (7.35 - 7.45)';
      alertColor = 'emerald';
    }

    let hypoxemia = '';
    if (paO2FiO2Ratio < 100) hypoxemia = '⚠️ SDRA Sévère (PaO2/FiO2 < 100)';
    else if (paO2FiO2Ratio < 200) hypoxemia = '⚠️ SDRA Modéré (PaO2/FiO2 < 200)';
    else if (paO2FiO2Ratio < 300) hypoxemia = '💡 SDRA Léger (PaO2/FiO2 < 300)';

    return { diagnosis, alertColor, hypoxemia };
  };

  const gdsResult = evaluateGds();

  // PSE Speed Calculation:
  // Speed (mL/h) = (Dose_ug_kg_min * Weight_kg * 60 min) / (Concentration_mg_ml * 1000 ug/mg)
  const pseSpeedMlH = ((pseDoseTarget * pseWeight * 60) / (pseConcentration * 1000)).toFixed(1);

  // Transfusion CGR Calculation:
  // Total CGR units = Weight * (HbTarget - HbActual) * 0.4 / 1.5 ~ (1 CGR increases Hb by ~1 g/dL in 70kg adult)
  const hbDelta = Math.max(0, transfusionHbTarget - transfusionHbActual);
  const cgrUnitsNeeded = Math.ceil(hbDelta * (transfusionWeight / 70));

  // IV Drip Speed: (Volume * 20 drops/mL) / (Hours * 60 min)
  const dropsPerMin = Math.round((dripVolume * 20) / (dripHours * 60));

  return (
    <div className="space-y-8">
      {/* 1. Header Mode Garde */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-rose-800 via-rose-700 to-indigo-900 text-white shadow-soft">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            <Siren className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
            <span>Companion du Praticien & Interne de Garde H24 (Algérie)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Mode Garde H24 & Urgences Réflexes 🚨
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Doses pédiatriques par kg, pousse-seringue électrique (PSE), interpréteur GDS avec trou anionique, antidotes de toxicologie et 10 urgences vitales.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-0.5">
            <div className="text-lg font-black text-rose-200">H24</div>
            <div className="text-[10px] text-rose-100 uppercase font-bold">Urgences UMC</div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('pedia')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'pedia'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>👶 Doses Pédiatriques</span>
        </button>

        <button
          onClick={() => setActiveTab('gds')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'gds'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>🧪 GDS & Trou Anionique</span>
        </button>

        <button
          onClick={() => setActiveTab('pse')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'pse'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>💉 Pousse-Seringue (PSE)</span>
        </button>

        <button
          onClick={() => setActiveTab('toxico')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'toxico'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>☣️ Toxico & Antidotes</span>
        </button>

        <button
          onClick={() => setActiveTab('transfusion')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'transfusion'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>🩸 Transfusion CGR</span>
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'protocols'
              ? 'bg-rose-600 text-white shadow-soft'
              : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
          }`}
        >
          <span>⚡ 10 Urgences Vitales</span>
        </button>

        <button
          onClick={() => setActiveTab('customHtml')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'customHtml'
              ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-soft font-black'
              : 'bg-white dark:bg-navy-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50'
          }`}
        >
          <span>✨ Pages HTML Admin ({customProtocols.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: PEDIATRIC DOSES & EQUIPMENT CALCULATOR */}
      {activeTab === 'pedia' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 sm:p-8 space-y-6 border border-rose-100 dark:border-rose-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-100 dark:border-navy-800">
              <div>
                <h2 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
                  <span>👶 Calculateur de Doses Pédiatriques & Matériel de Réanimation</span>
                </h2>
                <p className="text-xs text-navy-500">
                  Saisissez le poids et l'âge pour obtenir toutes les posologies de garde pédiatrique et la taille des sondes.
                </p>
              </div>

              <button
                onClick={() => handleCopy(
                  `POIDS ENFANT: ${pediaWeight}kg\n- Paracétamol: ${paracetamolDose}mg/prise\n- Amox: ${amoxicillineDose}mg/j\n- Solupred: ${solupredDose}mg/j\n- Adrénaline IM: ${adrenalineImDose}mg\n- Bolus Ringer/Salé: ${ringerBolusDose}mL\n- Valium IR: ${valiumIrDose}mg\n- Tube ETT: ${ettSize}mm`,
                  'pedia'
                )}
                className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shrink-0 self-start"
              >
                {copiedText === 'pedia' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>Copier Fiche Pédiatrique</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-1">
                <label className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                  Poids de l'Enfant (kg) :
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={pediaWeight}
                  onChange={e => setPediaWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-navy-900 text-lg font-black text-rose-700 dark:text-rose-300 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-1">
                <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                  Âge de l'Enfant (années) :
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={pediaAge}
                  onChange={e => setPediaAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-navy-900 text-lg font-black text-indigo-700 dark:text-indigo-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Output Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Paracétamol (IV / PO)</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {paracetamolDose} mg / prise
                </div>
                <div className="text-[10px] text-navy-500">15 mg/kg/prise toutes les 6h</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Amoxicilline Sirop/PO</span>
                <div className="text-xl font-black text-brand-600 dark:text-brand-400">
                  {amoxicillineDose} mg / jour
                </div>
                <div className="text-[10px] text-navy-500">80 mg/kg/j en 3 prises</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Solupred (Prednisolone)</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {solupredDose} mg / jour
                </div>
                <div className="text-[10px] text-navy-500">2 mg/kg/j le matin (Asthme/Laryngite)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Adrénaline IM (Choc Anaphylactique)</span>
                <div className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {adrenalineImDose} mg ({adrenalineImDose} mL de 1/1000)
                </div>
                <div className="text-[10px] text-navy-500">0.01 mg/kg IM face antéro-latérale cuisse</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Bolus Remplissage (Salé 0.9%)</span>
                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                  {ringerBolusDose} mL en 20 min
                </div>
                <div className="text-[10px] text-navy-500">20 mL/kg en bolus IV rapide</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Valium (Diazépam Intra-Rectal)</span>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                  {valiumIrDose} mg IR
                </div>
                <div className="text-[10px] text-navy-500">0.5 mg/kg IR si convulsion &gt; 5 min</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Ceftriaxone IV (Méningite / Sepsis)</span>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {ceftriaxonePediaDose} mg / jour
                </div>
                <div className="text-[10px] text-navy-500">100 mg/kg/j en 1-2 perfusions IV</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Taille Tube Intubation (ETT)</span>
                <div className="text-xl font-black text-teal-600 dark:text-teal-400">
                  N° {ettSize} mm
                </div>
                <div className="text-[10px] text-navy-500">Formule : (Âge / 4) + 4 mm</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-1">
                <span className="text-[11px] font-bold text-navy-400 block uppercase">Sonde Gastrique / Aspiration</span>
                <div className="text-xl font-black text-navy-700 dark:text-navy-300">
                  N° {ngtSize} Fr
                </div>
                <div className="text-[10px] text-navy-500">Formule : (Âge x 2) + 8 Fr</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: GDS & ANION GAP INTERPRETER */}
      {activeTab === 'gds' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-navy-950 dark:text-white">
                🧪 Interpréteur GDS, Trou Anionique & Rapport PaO2/FiO2
              </h2>
              <p className="text-xs text-navy-500">
                Saisissez les constantes artérielles et le bilan ionique pour l'analyse physiopathologique immédiate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">pH (Normale 7.35 - 7.45) :</label>
                <input
                  type="number"
                  step="0.01"
                  value={gdsPh}
                  onChange={e => setGdsPh(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-lg font-bold text-navy-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">PaCO2 mmHg (Normale 35 - 45) :</label>
                <input
                  type="number"
                  value={gdsPaco2}
                  onChange={e => setGdsPaco2(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-lg font-bold text-navy-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">HCO3- mmol/L (Normale 22 - 26) :</label>
                <input
                  type="number"
                  value={gdsHco3}
                  onChange={e => setGdsHco3(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-lg font-bold text-navy-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">Sodium Na+ (mmol/L) :</label>
                <input
                  type="number"
                  value={gdsNa}
                  onChange={e => setGdsNa(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-lg font-bold text-navy-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">Chlore Cl- (mmol/L) :</label>
                <input
                  type="number"
                  value={gdsCl}
                  onChange={e => setGdsCl(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-lg font-bold text-navy-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200 block">PaO2 / FiO2 (%) :</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={gdsPao2}
                    onChange={e => setGdsPao2(Number(e.target.value))}
                    placeholder="PaO2"
                    className="w-1/2 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm font-bold"
                  />
                  <input
                    type="number"
                    value={gdsFio2}
                    onChange={e => setGdsFio2(Number(e.target.value))}
                    placeholder="FiO2 %"
                    className="w-1/2 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Output Card */}
            <div className={`p-6 rounded-3xl border-2 ${
              gdsResult.alertColor === 'rose'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100'
            } space-y-3`}>
              <span className="text-xs font-bold uppercase tracking-wider block">Diagnostic Acidobasique & Oxygénation :</span>
              <h3 className="text-lg font-black">{gdsResult.diagnosis}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-current">
                  <strong>Trou Anionique :</strong> {anionGap} mmol/L (Normal: 8-12).
                  {Number(anionGap) > 12 && <div className="text-rose-600 font-bold mt-0.5">⚠️ Trou Anionique Élevé (Acidose Lactique, Acidocétose, Toxiques)</div>}
                </div>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-current">
                  <strong>Rapport PaO2 / FiO2 :</strong> {paO2FiO2Ratio} mmHg
                  {gdsResult.hypoxemia && <div className="font-bold text-amber-700 dark:text-amber-300 mt-0.5">{gdsResult.hypoxemia}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: POUSSE-SERINGUE ÉLECTRIQUE (PSE) */}
      {activeTab === 'pse' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
                <Syringe className="w-5 h-5 text-rose-600" />
                <span>Calculateur de Débit Pousse-Seringue Électrique (PSE)</span>
              </h2>
              <p className="text-xs text-navy-500">
                Calcul immédiat de la vitesse de pousse-seringue (mL/h) pour les amines vasoactives et l'héparine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Médicament en PSE :</label>
                <select
                  value={pseDrug}
                  onChange={e => {
                    const val = e.target.value as any;
                    setPseDrug(val);
                    if (val === 'noradre' || val === 'adre') setPseDoseTarget(0.2);
                    else if (val === 'dobutamine') setPseDoseTarget(5);
                    else if (val === 'heparine') setPseDoseTarget(20);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                >
                  <option value="noradre">Noradrénaline (µg/kg/min)</option>
                  <option value="adre">Adrénaline IVSE (µg/kg/min)</option>
                  <option value="dobutamine">Dobutamine (µg/kg/min)</option>
                  <option value="heparine">Héparine HNF (UI/kg/h)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Poids du Patient (kg) :</label>
                <input
                  type="number"
                  value={pseWeight}
                  onChange={e => setPseWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Dose Cible ({pseDrug === 'heparine' ? 'UI/kg/h' : 'µg/kg/min'}) :</label>
                <input
                  type="number"
                  step="0.05"
                  value={pseDoseTarget}
                  onChange={e => setPseDoseTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                />
              </div>
            </div>

            {/* Calculated PSE Speed */}
            <div className="p-6 rounded-3xl bg-rose-900 text-white space-y-2 text-center">
              <span className="text-xs uppercase font-bold text-rose-300 tracking-wider block">Débit PSE à régler sur le pousse-seringue :</span>
              <div className="text-4xl font-black text-white">
                {pseSpeedMlH} mL / heure
              </div>
              <p className="text-xs text-rose-200">
                Préparation standard : 50 mg de produit complété à 50 mL de G5% ou SSI (soit 1 mg/mL).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: TOXICOLOGY & ANTIDOTES */}
      {activeTab === 'toxico' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-purple-600" />
              <span>Intoxication au Paracétamol (Fluimucil / N-Acétylcystéine)</span>
            </h3>
            <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed">
              <strong>Protocole IV (150 mg/kg) :</strong> Perfusion de charge 150 mg/kg dans 200 mL G5% sur 1h, puis 50 mg/kg sur 4h, puis 100 mg/kg sur 16h. Indiqué si prise &gt; 125 mg/kg ou selon nomogramme de Rumack-Matthew à H4.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-purple-600" />
              <span>Intoxication aux Organophosphorés (Insecticides)</span>
            </h3>
            <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed">
              <strong>Atropine IV :</strong> 1 à 2 mg IVD à répéter toutes les 5 à 10 min jusqu'à atropinisation (assèchement des sécrétions bronchiques, mydriase, FC &gt; 80 bpm) + Contrathion (Pralidoxime) 400 mg IVL.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-purple-600" />
              <span>Intoxication Opiacés / Morphine (Naloxone / Narcan)</span>
            </h3>
            <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed">
              <strong>Naloxone (Narcan) :</strong> 1 ampoule (0.4 mg) à titrer par bolus de 0.1 mg IV toutes les 2-3 minutes jusqu'à fréquence respiratoire &gt; 12/min. Risque de syndrome de sevrage aigu.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-purple-600" />
              <span>Intoxication Benzodiazépines (Flumazénil / Anxate)</span>
            </h3>
            <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed">
              <strong>Flumazénil (Anxate) :</strong> 0.2 mg IVL en 30 sec, renouvelable de 0.1 mg par minute (max 1 mg). Contre-indiqué en cas de co-ingestion d'antidépresseurs tricycliques (risque de convulsion).
            </p>
          </div>
        </div>
      )}

      {/* 7. TAB 5: TRANSFUSION CGR */}
      {activeTab === 'transfusion' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600" />
                <span>Calculateur de Culots Globulaires Rouges (CGR)</span>
              </h2>
              <p className="text-xs text-navy-500">
                Estimation du nombre de culots globulaires nécessaires pour atteindre l'objectif d'hémoglobine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Poids du Patient (kg) :</label>
                <input
                  type="number"
                  value={transfusionWeight}
                  onChange={e => setTransfusionWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Hémoglobine Actuelle (g/dL) :</label>
                <input
                  type="number"
                  step="0.5"
                  value={transfusionHbActual}
                  onChange={e => setTransfusionHbActual(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 space-y-1">
                <label className="font-bold text-navy-800 dark:text-navy-200 block">Hémoglobine Cible (g/dL) :</label>
                <input
                  type="number"
                  step="0.5"
                  value={transfusionHbTarget}
                  onChange={e => setTransfusionHbTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 font-bold"
                />
              </div>
            </div>

            {/* Calculated CGR Output */}
            <div className="p-6 rounded-3xl bg-rose-950 text-white space-y-2 text-center border border-rose-800">
              <span className="text-xs uppercase font-bold text-rose-300 tracking-wider block">Nombre de Culots Globulaires (CGR) à Transfuser :</span>
              <div className="text-4xl font-black text-rose-400">
                {cgrUnitsNeeded} CGR Iso-Groupe Iso-Rhésus
              </div>
              <p className="text-xs text-navy-300">
                Règle pratique : 1 CGR augmente le taux d'hémoglobine d'environ 1 g/dL chez un adulte de 70 kg.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: 10 VITAL EMERGENCY PROTOCOLS */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              1. Arrêt Cardio-Respiratoire (ACR) - ACLS
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>MCE 100-120/min + O2 15L/min + Adrénaline 1mg IVD</strong> toutes les 3-5 min. Si Rythme Chocable (FV/TV sans pouls) : CEE 200J puis <strong>Amiodarone 300mg IVD</strong> après le 3ème choc.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              2. Choc Anaphylactique Aigu
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>Adrénaline IM d'emblée :</strong> 0.5 mg IM chez l'adulte (0.01 mg/kg chez l'enfant) dans la cuisse. Remplissage cristalloïdes 500-1000 mL rapide + Corticoïdes IV.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              3. Œdème Aigu du Poumon (OAP) Cardiogénique
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>Position assise stricte + O2 fort débit + Furosémide (Lasilix) 40 à 80 mg IVD</strong> + Lénitral spray 2 bouffées sous-linguales si PAS &gt; 110 mmHg. VNI / CPAP si détresse.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              4. État de Mal Épileptique Généralisé
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>Clonazépam (Rivotril) 1 mg IVL sur 2 min</strong> ou Diazépam (Valium) 10 mg IR/IV. Si échec à 5 min : renouveler 1 fois puis passer à la Phénytoïne / Lévétiracétam IV.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              5. Hypoglycémie Sévère avec Coma
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>G30% IVD :</strong> 2 à 3 ampoules de 20 mL de Glucose 30% en bolus IV direct (ou Glucagon 1mg IM si voie IV impossible). Relais par perfusion G10%.
            </p>
          </div>

          <div className="apple-card p-6 space-y-3 border-l-4 border-l-rose-500">
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              6. Hyperkaliémie Menaçante (K+ &gt; 6.5 mmol/L ou Ondes T pointues)
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300">
              <strong>Gluconate de Calcium 10% :</strong> 1 ampoule (10 mL) IVL sur 2-3 min (protection cardiaque). Puis <strong>Insuline 10 UI + 500 mL G10% en 30 min</strong> + Nébulisation Salbutamol.
            </p>
          </div>
        </div>
      )}

      {/* TAB 7: CUSTOM HTML PROTOCOLS EDITED FROM ADMIN PANEL */}
      {activeTab === 'customHtml' && (
        <div className="space-y-6">
          {customProtocols.length === 0 ? (
            <div className="apple-card p-12 text-center text-navy-400 text-xs">
              Aucune page HTML personnalisée n'a été ajoutée depuis le Panneau Admin pour le moment.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Protocol selector pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {customProtocols.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProtocolId(p.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedProtocolId === p.id
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
                    }`}
                  >
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>

              {/* HTML Content Rendering Container */}
              {(() => {
                const currentProtocol = customProtocols.find(p => p.id === selectedProtocolId) || customProtocols[0];
                if (!currentProtocol) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black rounded-full uppercase">
                        {currentProtocol.badge || 'H24'} • {currentProtocol.category}
                      </span>
                      <span className="text-xs text-navy-400 font-mono">
                        Édité depuis le Panneau Admin
                      </span>
                    </div>

                    <div
                      className="rounded-3xl overflow-hidden shadow-soft"
                      dangerouslySetInnerHTML={{ __html: currentProtocol.htmlContent }}
                    />
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
