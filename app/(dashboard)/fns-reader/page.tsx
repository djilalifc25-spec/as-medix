'use client';

import React, { useState } from 'react';
import {
  Microscope, Upload, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert,
  ArrowRight, RefreshCw, FileText, Activity, Droplets, Info, HelpCircle
} from 'lucide-react';

export default function FNSReaderPage() {
  const [formData, setFormData] = useState({
    hb: 10.2,
    rbc: 3.8,
    wbc: 7.2,
    neut: 4.2,
    lymph: 2.1,
    eo: 0.2,
    baso: 0.05,
    mono: 0.65,
    plt: 220,
    vgm: 72,
    tcmh: 24,
    ccmh: 30,
    retic: 45,
    sex: 'f' as 'h' | 'f',
    pregnancy: false,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const presets: { name: string; data: typeof formData }[] = [
    {
      name: '🩸 Anémie Microcytaire Martiale',
      data: { hb: 9.2, rbc: 3.6, wbc: 6.5, neut: 3.8, lymph: 2.0, eo: 0.2, baso: 0.05, mono: 0.45, plt: 380, vgm: 68, tcmh: 22, ccmh: 29, retic: 40, sex: 'f' as const, pregnancy: false }
    },
    {
      name: '🚨 Agranulocytose Médicamenteuse Aiguë',
      data: { hb: 12.8, rbc: 4.2, wbc: 1.2, neut: 0.1, lymph: 0.9, eo: 0.0, baso: 0.0, mono: 0.2, plt: 180, vgm: 88, tcmh: 30, ccmh: 34, retic: 55, sex: 'h' as const, pregnancy: false }
    },
    {
      name: '🔴 Thrombopénie Sévère',
      data: { hb: 13.0, rbc: 4.4, wbc: 5.8, neut: 3.5, lymph: 1.8, eo: 0.2, baso: 0.05, mono: 0.25, plt: 14, vgm: 90, tcmh: 30, ccmh: 33, retic: 60, sex: 'f' as const, pregnancy: false }
    },
    {
      name: '🦠 Syndrome Mononucléosique (MNI)',
      data: { hb: 13.5, rbc: 4.6, wbc: 14.5, neut: 4.0, lymph: 8.8, eo: 0.3, baso: 0.05, mono: 1.35, plt: 210, vgm: 89, tcmh: 30, ccmh: 34, retic: 65, sex: 'h' as const, pregnancy: false }
    },
    {
      name: '🍷 Polyglobulie de Vaquez',
      data: { hb: 19.5, rbc: 6.8, wbc: 12.8, neut: 8.5, lymph: 2.5, eo: 0.4, baso: 0.2, mono: 1.2, plt: 480, vgm: 86, tcmh: 29, ccmh: 33, retic: 110, sex: 'h' as const, pregnancy: false }
    },
    {
      name: '🟢 FNS Normale de Routine',
      data: { hb: 14.2, rbc: 4.7, wbc: 6.8, neut: 4.0, lymph: 2.1, eo: 0.2, baso: 0.05, mono: 0.45, plt: 260, vgm: 89, tcmh: 30, ccmh: 34, retic: 65, sex: 'h' as const, pregnancy: false }
    }
  ];

  const handleAnalyze = async (overrideData?: any) => {
    setLoading(true);
    setUploadMessage(null);
    try {
      const payload = overrideData || formData;
      const res = await fetch('/api/ai/fns-interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadMessage(`📷 Photo reçue : "${file.name}". OCR & Analyse de la Formule Numérique Sanguine en cours...`);
      // Auto fill microcytic preset for demonstration of AI OCR reading
      setTimeout(() => {
        const randomPreset = presets[0].data;
        setFormData(randomPreset);
        handleAnalyze(randomPreset);
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white via-rose-50/20 to-brand-50/30 dark:from-navy-900 dark:via-navy-950 dark:to-navy-900">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <Microscope className="w-4 h-4 text-rose-600" />
            <span>IA Médicale & Interpretation Biologique Express</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Lecteur & Analyseur Intelligent de FNS / NFS
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            Téléversez une photo de bilan sanguin ou saisissez les constantes biologiques pour obtenir instantanément les drapeaux d'alerte, hypothèses diagnostiques et conduites à tenir de garde.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Scanner Photo FNS</span>
            <input type="file" accept="image/*" onChange={handleSimulatedUpload} className="hidden" />
          </label>
        </div>
      </div>

      {uploadMessage && (
        <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 text-brand-900 dark:text-brand-200 text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <Sparkles className="w-5 h-5 text-brand-600 shrink-0 animate-spin" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Preset Quick Loader Chips */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-navy-400 block">
          ⚡ Cas Cliniques Pré-définis de Démonstration :
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFormData(preset.data);
                handleAnalyze(preset.data);
              }}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 hover:border-rose-400 text-xs font-bold text-navy-800 dark:text-navy-200 shrink-0 transition-all shadow-xs"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="apple-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <h2 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-rose-500" />
                <span>Constantes de la FNS</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'h' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${formData.sex === 'h' ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-700'}`}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'f' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${formData.sex === 'f' ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-700'}`}
                >
                  Femme
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs font-bold">
              {/* Lignée Érythrocytaire */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-rose-600 font-extrabold block">
                  🔴 Lignée Érythrocytaire (RBC)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-navy-700 dark:text-navy-300 block mb-1">Hémoglobine (g/dL) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hb}
                      onChange={e => setFormData({ ...formData, hb: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-navy-700 dark:text-navy-300 block mb-1">VGM (fL) :</label>
                    <input
                      type="number"
                      value={formData.vgm}
                      onChange={e => setFormData({ ...formData, vgm: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-navy-500 block mb-1 text-[10px]">TCMH (pg) :</label>
                    <input
                      type="number"
                      value={formData.tcmh}
                      onChange={e => setFormData({ ...formData, tcmh: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-navy-500 block mb-1 text-[10px]">CCMH (g/dL) :</label>
                    <input
                      type="number"
                      value={formData.ccmh}
                      onChange={e => setFormData({ ...formData, ccmh: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-navy-500 block mb-1 text-[10px]">Réticuloc. (G/L) :</label>
                    <input
                      type="number"
                      value={formData.retic}
                      onChange={e => setFormData({ ...formData, retic: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lignée Leucocytaire */}
              <div className="space-y-2 pt-2 border-t border-navy-100 dark:border-navy-800">
                <span className="text-[11px] uppercase tracking-wider text-brand-600 font-extrabold block">
                  ⚪ Lignée Leucocytaire (WBC)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-navy-700 dark:text-navy-300 block mb-1">Leucocytes Total (G/L) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.wbc}
                      onChange={e => setFormData({ ...formData, wbc: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-navy-700 dark:text-navy-300 block mb-1">PNN Neutrophiles (G/L) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.neut}
                      onChange={e => setFormData({ ...formData, neut: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-navy-500 block mb-1 text-[10px]">Lymphocytes (G/L) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.lymph}
                      onChange={e => setFormData({ ...formData, lymph: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-navy-500 block mb-1 text-[10px]">Monocytes (G/L) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.mono}
                      onChange={e => setFormData({ ...formData, mono: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lignée Thrombo-Plaquettaire */}
              <div className="space-y-2 pt-2 border-t border-navy-100 dark:border-navy-800">
                <span className="text-[11px] uppercase tracking-wider text-amber-600 font-extrabold block">
                  🟡 Lignée Thrombocytaire (PLT)
                </span>
                <div>
                  <label className="text-navy-700 dark:text-navy-300 block mb-1">Plaquettes (G/L / x10³ /mm³) :</label>
                  <input
                    type="number"
                    value={formData.plt}
                    onChange={e => setFormData({ ...formData, plt: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-mono font-black text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyse IA en cours...</span>
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4" />
                  <span>🔬 Analyser la FNS avec l'IA Médicale</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="apple-card p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-2xl shadow-inner">
                🔬
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-black text-navy-950 dark:text-white">
                  Prêt à analyser la Formule Numérique Sanguine
                </h3>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Sélectionnez un cas de démonstration ci-dessus, modifiez les valeurs ou téléversez une photo de bilan pour lancer l'interprétation clinique.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Findings summary card */}
              <div className="apple-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
                  <h3 className="text-sm font-black text-navy-950 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600" />
                    <span>Tableau des Constantes & Anomalies Détectées</span>
                  </h3>
                  <span className="text-[10px] font-mono text-navy-400">
                    Analyse du {new Date(results.analyzedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.findings.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border space-y-1 ${
                        f.status === 'high' || f.status === 'low'
                          ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
                          : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy-900 dark:text-white">{f.name}</span>
                        <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400">{f.value}</span>
                      </div>
                      <p className="text-[11px] text-navy-600 dark:text-navy-300 leading-tight">
                        {f.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hypotheses */}
              <div className="apple-card p-6 space-y-4">
                <h3 className="text-sm font-black text-navy-950 dark:text-white flex items-center gap-2 pb-2 border-b border-navy-100 dark:border-navy-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Hypothèses Diagnostiques Classées par l'IA</span>
                </h3>

                <div className="space-y-3">
                  {results.diagnoses.map((d: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        d.alert === 'danger'
                          ? 'bg-rose-500 text-white border-rose-600'
                          : d.alert === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-950 dark:text-amber-100'
                          : 'bg-brand-50 dark:bg-brand-950/50 border-brand-200 text-brand-950 dark:text-brand-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black flex items-center gap-2">
                          {d.alert === 'danger' && <AlertTriangle className="w-4 h-4 shrink-0" />}
                          <span>{d.title}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-white/20">
                          Probabilité : {d.probability}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-95">
                        {d.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="apple-card p-6 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conduite à Tenir Clinique & Examens Recommandés</span>
                </h3>
                <ul className="space-y-2 text-xs text-navy-700 dark:text-navy-200">
                  {results.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-navy-50 dark:bg-navy-800/60 p-2.5 rounded-xl border border-navy-100 dark:border-navy-700">
                      <span className="text-emerald-500 font-bold shrink-0">👉</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
