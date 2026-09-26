'use client';

import React, { useState, useEffect } from 'react';
import PHARMNET_MEDS from '@/lib/db/pharmnet_meds.json';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Brain, ShieldAlert, Activity, Pill, ArrowRight } from 'lucide-react';

interface SearchResult {
  type: 'cours' | 'fiche' | 'qcm' | 'cat' | 'ecg' | 'medicament';
  title: string;
  subtitle: string;
  link: string;
}

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const staticResults: SearchResult[] = [
      { type: 'cours', title: 'La Tuberculose Pulmonaire', subtitle: 'Pneumologie • Bacilloscopie & RHZE', link: '/cours/tuberculose-pulmonaire' },
      { type: 'cours', title: 'Le Rétrécissement Mitral', subtitle: 'Cardiologie • Rythme de Duroziez & CMP', link: '/cours/retrecissement-mitral' },
      { type: 'cours', title: 'L\'Accident Vasculaire Cérébral Ischémique', subtitle: 'Neurologie • Thrombolyse & Thrombectomie', link: '/cours/avc-ischemique' },
      { type: 'cours', title: 'L\'Insuffisance Cardiaque Aiguë & Chronique', subtitle: 'Cardiologie • FEVG, ARNI, SGLT2', link: '/cours/insuffisance-cardiaque' },
      { type: 'qcm', title: 'QCM Tuberculose : Bactériologie de certitude', subtitle: 'Pneumologie • Examen direct Ziehl-Neelsen', link: '/qcm/qcm_tb_1' },
      { type: 'qcm', title: 'QCM Rétrécissement Mitral : Triade auscultatoire', subtitle: 'Cardiologie • B1, COM, Roulement', link: '/qcm/qcm_rm_1' },
      { type: 'cat', title: 'CAT : Choc Cardiogénique en Urgence', subtitle: 'Cardiologie • Dobutamine & Angioplastie', link: '/cat/choc-cardiogenique' },
      { type: 'cat', title: 'CAT : Asthme Aigu Grave (AAG)', subtitle: 'Pneumologie • Nébulisations Salbutamol', link: '/cat/asthme-aigu-grave' },
      { type: 'ecg', title: 'ECG : Fibrillation Atriale Rapide', subtitle: 'Trouble du rythme • Anarchie ventriculaire', link: '/ecg' },
    ];

    const matchedStatic = staticResults.filter(item =>
      item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );

    // Live search in Pharmnet DZ (Algerian medications database)
    const matchedMeds: SearchResult[] = (PHARMNET_MEDS as any[])
      .filter(m =>
        m.nomCommercial.toLowerCase().includes(q) ||
        m.dci.toLowerCase().includes(q) ||
        (m.laboratoire && m.laboratoire.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map(m => ({
        type: 'medicament',
        title: `${m.nomCommercial} (${m.forme} ${m.dosage})`,
        subtitle: `Pharmnet DZ • DCI: ${m.dci} • ${m.prixPpa ? m.prixPpa + ' DA' : 'Hôpital'}`,
        link: `/medicaments?search=${encodeURIComponent(m.nomCommercial)}&id=${m.id}`,
      }));

    setResults([...matchedMeds, ...matchedStatic]);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    router.push(url);
    onClose();
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'cours': return <BookOpen className="w-4 h-4 text-brand-600" />;
      case 'qcm': return <Brain className="w-4 h-4 text-emerald-600" />;
      case 'cat': return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'ecg': return <Activity className="w-4 h-4 text-amber-600" />;
      case 'medicament': return <Pill className="w-4 h-4 text-cyan-600" />;
      default: return <BookOpen className="w-4 h-4 text-navy-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-navy-200 dark:border-navy-700 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-navy-100 dark:border-navy-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-navy-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un cours, une fiche, un QCM, une pathologie..."
            className="w-full bg-transparent text-sm sm:text-base text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-navy-400 hover:text-navy-700 dark:hover:text-white rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center text-sm text-navy-500">
              Aucun résultat médical trouvé pour "{query}".
            </div>
          )}

          {!query.trim() && (
            <div className="p-6 text-xs text-navy-400 space-y-2">
              <div className="font-bold uppercase tracking-wider text-navy-500">Recherches rapides suggérées :</div>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Tuberculose', 'Rétrécissement mitral', 'Choc cardiogénique', 'AVC ischémique', 'Fibrillation atriale', 'Furosémide'].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(res.link)}
                  className="w-full text-left p-3 rounded-2xl hover:bg-navy-50 dark:hover:bg-navy-800/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center shrink-0">
                      {getIcon(res.type)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        {res.title}
                      </div>
                      <div className="text-xs text-navy-500 dark:text-navy-400">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    Voir <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
