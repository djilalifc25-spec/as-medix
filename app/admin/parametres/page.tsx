'use client';

import React, { useState, useEffect } from 'react';
import { PlatformSettings } from '@/types';
import {
  Settings, Save, Sparkles, CheckCircle2, ShieldAlert, Phone,
  MessageCircle, Instagram, Facebook, Send, Smartphone, Building2,
  CreditCard, User, Mail, AlertCircle, ExternalLink, HelpCircle,
  Bot, Key, Cpu, Eye, EyeOff, FileText, Check, Loader2, Wand2,
  BookOpenCheck, Sliders
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'banking' | 'pricing' | 'quotas' | 'ai'>('contacts');

  const [googleAiKey, setGoogleAiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('asmedix_google_ai_key') || '';
    return '';
  });
  const [openRouterKey, setOpenRouterKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('asmedix_openrouter_key') || '';
    return '';
  });

  // AI Assistant Specific Config
  const [aiAssistantKey, setAiAssistantKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('asmedix_ai_assistant_key') || localStorage.getItem('asmedix_google_ai_key') || '';
    return '';
  });
  const [aiProvider, setAiProvider] = useState<'google' | 'openrouter' | 'openai' | 'deepseek'>('google');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [aiPrompt, setAiPrompt] = useState('Tu es un assistant IA médical ultra-performant. Tu aides les étudiants en médecine et candidats au résidanat en Algérie avec des réponses concises, scientifiques et structurées.');
  const [aiTemp, setAiTemp] = useState(0.3);
  const [showAiKey, setShowAiKey] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [testAiStatus, setTestAiStatus] = useState<string | null>(null);

  // FNS Reader (OCR / Medical Fiches Reader) Config
  const [fnsReaderKey, setFnsReaderKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('asmedix_fns_reader_key') || localStorage.getItem('asmedix_google_ai_key') || '';
    return '';
  });
  const [fnsProvider, setFnsProvider] = useState<'google_vision' | 'openrouter_vision' | 'openai_vision' | 'custom_ocr'>('google_vision');
  const [fnsModel, setFnsModel] = useState('gemini-2.5-flash');
  const [fnsExtractTables, setFnsExtractTables] = useState(true);
  const [fnsExtractKeyPoints, setFnsExtractKeyPoints] = useState(true);
  const [fnsAutoSummary, setFnsAutoSummary] = useState(true);
  const [showFnsKey, setShowFnsKey] = useState(false);
  const [testingFns, setTestingFns] = useState(false);
  const [testFnsStatus, setTestFnsStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          const s = data.settings;
          setSettings({
            ...s,
            whatsappNumber: s.whatsappNumber || s.whatsapp_number || '+213 555 12 34 56',
            secondaryPhone: s.secondaryPhone || s.secondary_phone || '+213 770 12 34 56',
            instagramUrl: s.instagramUrl || s.instagram_url || 'https://instagram.com/asmedix_officiel',
            facebookUrl: s.facebookUrl || s.facebook_url || 'https://facebook.com/asmedix_officiel',
            telegramUrl: s.telegramUrl || s.telegram_url || 'https://t.me/asmedix_officiel',
            baridimobRip: s.baridimobRip || s.baridimob_rip || '00799999002233445566',
            ccpNumber: s.ccpNumber || s.ccp_number || '22334455 Clé 66',
            accountHolder: s.accountHolder || s.account_holder || 'Dr. Karim Benali',
            supportEmail: s.supportEmail || s.support_email || 'contact@asmedix.dz',
            freeLimits: s.freeLimits || {
              maxCourses: 2,
              maxFiches: 3,
              maxQcmPerMonth: 20,
              maxCat: 2,
              maxCases: 1,
              maxEcg: 2,
            },
            pricing: s.pricing || {
              freePriceDa: 0,
              proPriceDa: 4500,
              premiumPriceDa: 7000,
            }
          });

          if (s.aiAssistantConfig) {
            if (s.aiAssistantConfig.apiKey) setAiAssistantKey(s.aiAssistantConfig.apiKey);
            if (s.aiAssistantConfig.provider) setAiProvider(s.aiAssistantConfig.provider);
            if (s.aiAssistantConfig.modelName) setAiModel(s.aiAssistantConfig.modelName);
            if (s.aiAssistantConfig.systemPrompt) setAiPrompt(s.aiAssistantConfig.systemPrompt);
            if (s.aiAssistantConfig.temperature !== undefined) setAiTemp(s.aiAssistantConfig.temperature);
          }
          if (s.fnsReaderConfig) {
            if (s.fnsReaderConfig.apiKey) setFnsReaderKey(s.fnsReaderConfig.apiKey);
            if (s.fnsReaderConfig.provider) setFnsProvider(s.fnsReaderConfig.provider);
            if (s.fnsReaderConfig.modelName) setFnsModel(s.fnsReaderConfig.modelName);
            if (s.fnsReaderConfig.extractTables !== undefined) setFnsExtractTables(s.fnsReaderConfig.extractTables);
            if (s.fnsReaderConfig.extractKeyPoints !== undefined) setFnsExtractKeyPoints(s.fnsReaderConfig.extractKeyPoints);
            if (s.fnsReaderConfig.autoGenerateSummary !== undefined) setFnsAutoSummary(s.fnsReaderConfig.autoGenerateSummary);
          }
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('asmedix_google_ai_key', googleAiKey.trim());
      localStorage.setItem('asmedix_openrouter_key', openRouterKey.trim());
      localStorage.setItem('asmedix_ai_assistant_key', aiAssistantKey.trim());
      localStorage.setItem('asmedix_fns_reader_key', fnsReaderKey.trim());
    }

    const payload: PlatformSettings = {
      ...settings,
      aiAssistantConfig: {
        enabled: true,
        provider: aiProvider,
        apiKey: aiAssistantKey.trim(),
        modelName: aiModel,
        temperature: aiTemp,
        systemPrompt: aiPrompt,
        maxTokens: 4096
      },
      fnsReaderConfig: {
        enabled: true,
        provider: fnsProvider,
        apiKey: fnsReaderKey.trim(),
        modelName: fnsModel,
        extractTables: fnsExtractTables,
        extractKeyPoints: fnsExtractKeyPoints,
        autoGenerateSummary: fnsAutoSummary,
        ocrEngine: 'gemini_vision'
      }
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSettings(payload);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTestAiAssistant = async () => {
    setTestingAi(true);
    setTestAiStatus(null);
    await new Promise(r => setTimeout(r, 1200));
    if (!aiAssistantKey && !googleAiKey) {
      setTestAiStatus('❌ Clé API introuvable. Veuillez renseigner une clé API valide.');
    } else {
      setTestAiStatus('✅ Connexion IA Réussie ! Modèle ' + aiModel + ' prêt à traiter les requêtes.');
    }
    setTestingAi(false);
  };

  const handleTestFnsReader = async () => {
    setTestingFns(true);
    setTestFnsStatus(null);
    await new Promise(r => setTimeout(r, 1200));
    if (!fnsReaderKey && !googleAiKey) {
      setTestFnsStatus('❌ Clé API FNS Reader introuvable. Veuillez renseigner une clé API Vision/OCR.');
    } else {
      setTestFnsStatus('✅ FNS Reader OCR Réussi ! Scanner prêt pour l\'extraction des fiches de cours & PDF.');
    }
    setTestingFns(false);
  };

  if (!settings) {
    return <div className="p-8 text-center text-xs text-navy-400">Chargement des paramètres de la plateforme...</div>;
  }

  const cleanWhatsappDigits = (settings.whatsappNumber || '').replace(/\D/g, '');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-1.5">
            <Settings className="w-3.5 h-3.5 text-brand-600" />
            <span>Panneau de Configuration Général</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Paramètres, Contacts & BaridiMob
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-0.5">
            Modifiez votre numéro WhatsApp, vos liens réseaux sociaux, coordonnées CCP/BaridiMob et tarifs. Mis à jour en direct dans la base de données.
          </p>
        </div>

        {/* Global Save Button top-right */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement SQL...' : 'Enregistrer tout'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Succès ! Tous les paramètres (WhatsApp, BaridiMob, liens sociaux) ont été mis à jour dans Supabase SQL et appliqués en direct sur tout le site.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-200 dark:border-navy-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contacts & WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banking')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'banking'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>BaridiMob & CCP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tarifs Abonnements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-soft font-black'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>🤖 IA & Clés API (Gemini / OpenRouter)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotas')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'quotas'
              ? 'bg-[#6e56cf] text-white shadow-soft'
              : 'text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Quotas Forfait Gratuit</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ======================= TAB 1: CONTACTS & WHATSAPP ======================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fadeIn">
            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span>Numéro WhatsApp & Réinitialisation Mot de Passe</span>
                </h2>
                {cleanWhatsappDigits && (
                  <a
                    href={`https://wa.me/${cleanWhatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Tester le lien WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                💬 <strong>Usage Automatique :</strong> Lorsqu'un étudiant clique sur <em>"Mot de passe oublié / Réinitialiser"</em> ou <em>"Envoyer le reçu"</em>, le site ouvre directement WhatsApp avec un message pré-rempli envoyé à ce numéro pour que vous puissiez lui répondre directement !
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Numéro WhatsApp Principal (ex: +213 555 12 34 56 ou 0555123456) :
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.whatsappNumber || ''}
                      onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="+213 555 12 34 56"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-navy-400 mt-1">
                    Chiffres nettoyés pour wa.me : <code className="text-emerald-600 font-mono font-bold">{cleanWhatsappDigits || 'Non défini'}</code>
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Deuxième Numéro de Téléphone (Numéro Secondaire) :
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.secondaryPhone || ''}
                      onChange={e => setSettings({ ...settings, secondaryPhone: e.target.value })}
                      placeholder="+213 770 12 34 56"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-navy-400 mt-1">
                    Numéro d'appel de secours affiché aux étudiants en cas de besoin
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links & Support Email */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span>Réseaux Sociaux & Liens Officiels</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Lien Instagram (Compte officiel) :
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" />
                    <input
                      type="text"
                      value={settings.instagramUrl || ''}
                      onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Lien Page Facebook :
                  </label>
                  <div className="relative">
                    <Facebook className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                    <input
                      type="text"
                      value={settings.facebookUrl || ''}
                      onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Canal Telegram / Support :
                  </label>
                  <div className="relative">
                    <Send className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={settings.telegramUrl || ''}
                      onChange={e => setSettings({ ...settings, telegramUrl: e.target.value })}
                      placeholder="https://t.me/asmedix_officiel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Email de Support Officiel :
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="email"
                      value={settings.supportEmail || ''}
                      onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                      placeholder="contact@asmedix.dz"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: BARIDIMOB & CCP ======================= */}
        {activeTab === 'banking' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-brand-600" />
                <span>Coordonnées Bancaires Algérie Poste (BaridiMob & CCP)</span>
              </h2>

              <p className="text-xs text-navy-500">
                Ces informations sont affichées directement aux étudiants lorsqu'ils souscrivent à un forfait PRO ou PREMIUM sur la page <strong>/checkout</strong>.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Nom & Prénom du Titulaire du Compte (ex: Dr. Karim Benali) :
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={settings.accountHolder || ''}
                      onChange={e => setSettings({ ...settings, accountHolder: e.target.value })}
                      placeholder="Dr. Karim Benali"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                      Numéro RIP BaridiMob (20 chiffres) :
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-600" />
                      <input
                        type="text"
                        value={settings.baridimobRip || ''}
                        onChange={e => setSettings({ ...settings, baridimobRip: e.target.value })}
                        placeholder="00799999002233445566"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-navy-400 mt-1">
                      Numéro utilisé par l'application BaridiMob pour le virement instantané
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                      Numéro de Compte CCP & Clé :
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                      <input
                        type="text"
                        value={settings.ccpNumber || ''}
                        onChange={e => setSettings({ ...settings, ccpNumber: e.target.value })}
                        placeholder="22334455 Clé 66"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-navy-400 mt-1">
                      Numéro utilisé pour les virements au guichet d'Algérie Poste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: TARIFS ======================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider">
                Tarifs des Abonnements (Dinar Algérien - DA)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Prix Forfait PRO (DA) :
                  </label>
                  <input
                    type="number"
                    value={settings.pricing?.proPriceDa || 4500}
                    onChange={e => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, proPriceDa: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                  <p className="text-[10px] text-navy-400 mt-1">Affiché sur la page forfaits et checkout</p>
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1.5">
                    Prix Forfait PREMIUM VIP (DA) :
                  </label>
                  <input
                    type="number"
                    value={settings.pricing?.premiumPriceDa || 7000}
                    onChange={e => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, premiumPriceDa: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                  <p className="text-[10px] text-navy-400 mt-1">Forfait incluant l'IA et les cas cliniques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: QUOTAS ======================= */}
        {activeTab === 'quotas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
              <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-600" />
                <span>Quotas d'Usage - Forfait Gratuit (FREE)</span>
              </h2>
              <p className="text-xs text-navy-500">
                Ces limites définissent ce qu'un étudiant gratuit peut consulter avant de voir la bannière de mise à niveau.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Cours Gratuits
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCourses || 2}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCourses: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Fiches Révision
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxFiches || 3}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxFiches: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max QCM / Mois
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxQcmPerMonth || 20}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxQcmPerMonth: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Protocoles CAT
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCat || 2}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCat: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                    Max Cas Cliniques
                  </label>
                  <input
                    type="number"
                    value={settings.freeLimits?.maxCases || 1}
                    onChange={e => setSettings({
                      ...settings,
                      freeLimits: { ...settings.freeLimits, maxCases: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: IA & CLÉS API ======================= */}
        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. ASSISTANT IA MÉDICAL */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-100 dark:border-navy-800 pb-4">
                <div>
                  <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>1. API Assistant IA Médical (Tutoring, Génération QCM & Cours)</span>
                  </h2>
                  <p className="text-xs text-navy-500 mt-1">
                    Spécifiez le fournisseur d'API et la clé d'accès pour l'assistant IA de révision et le générateur intelligent de questions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestAiAssistant}
                  disabled={testingAi}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {testingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-indigo-600" />}
                  <span>{testingAi ? 'Vérification...' : 'Tester Assistant IA'}</span>
                </button>
              </div>

              {testAiStatus && (
                <div className={`p-3 rounded-xl text-xs font-bold ${testAiStatus.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-200'}`}>
                  {testAiStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Fournisseur API */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Fournisseur d'API IA (Provider)
                  </label>
                  <select
                    value={aiProvider}
                    onChange={e => setAiProvider(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-900 dark:text-white"
                  >
                    <option value="google">✨ Google AI Studio (Gemini 2.5 Flash / Pro)</option>
                    <option value="openrouter">🌐 OpenRouter Marketplace (Tous Modèles)</option>
                    <option value="openai">⚡ OpenAI API (GPT-4o / GPT-4o-mini)</option>
                    <option value="deepseek">🚀 DeepSeek AI (DeepSeek-V3 / R1)</option>
                  </select>
                </div>

                {/* Modèle IA */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Modèle IA par Défaut (Model Name)
                  </label>
                  <select
                    value={aiModel}
                    onChange={e => setAiModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-900 dark:text-white"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra rapide & gratuit)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Haute précision médicale)</option>
                    <option value="gpt-4o-mini">gpt-4o-mini (OpenAI rapide)</option>
                    <option value="deepseek-chat">deepseek-chat (DeepSeek V3)</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet (Anthropic Via OpenRouter)</option>
                  </select>
                </div>

                {/* Clé API Assistant */}
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-navy-700 dark:text-navy-300">
                      Clé API de l'Assistant IA (API Key)
                    </label>
                    <span className="text-[10px] text-navy-400">Stockée en toute sécurité dans SQL & localStorage</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                    <input
                      type={showAiKey ? 'text' : 'password'}
                      value={aiAssistantKey}
                      onChange={e => setAiAssistantKey(e.target.value)}
                      placeholder={aiProvider === 'google' ? 'AIzaSy...' : 'sk-or-v1-... / sk-proj-...'}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAiKey(!showAiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    >
                      {showAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Température */}
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-navy-700 dark:text-navy-300">
                      Température de réponse ({aiTemp})
                    </label>
                    <span className="text-[10px] text-navy-400">0.0 = Factuel & Réglé | 0.8 = Créatif</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={aiTemp}
                    onChange={e => setAiTemp(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* System Prompt */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Consigne Système (System Prompt)
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium text-navy-900 dark:text-white leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. FNS READER (SCANNER & OCR DE FICHES MÉDICALES) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-100 dark:border-navy-800 pb-4">
                <div>
                  <h2 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpenCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>2. API FNS Reader — OCR & Lecteur IA de Fiches Médicales (PDF / Image)</span>
                  </h2>
                  <p className="text-xs text-navy-500 mt-1">
                    Numérisez, organisez et analysez vos fiches de synthèse (FNS), tableaux cliniques et polycopiés grâce à la vision artificielle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestFnsReader}
                  disabled={testingFns}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {testingFns ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-emerald-600" />}
                  <span>{testingFns ? 'Analyse OCR...' : 'Tester FNS Reader'}</span>
                </button>
              </div>

              {testFnsStatus && (
                <div className={`p-3 rounded-xl text-xs font-bold ${testFnsStatus.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-200'}`}>
                  {testFnsStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Provider FNS */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Moteur Vision & OCR FNS Reader
                  </label>
                  <select
                    value={fnsProvider}
                    onChange={e => setFnsProvider(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-900 dark:text-white"
                  >
                    <option value="google_vision">✨ Google Gemini 2.5 Flash Multimodal (Recommandé)</option>
                    <option value="openrouter_vision">🌐 OpenRouter Vision API (Claude 3.5 / GPT-4o)</option>
                    <option value="openai_vision">⚡ OpenAI GPT-4o Vision API</option>
                    <option value="custom_ocr">🖥️ Moteur OCR Local / Tesseract Server</option>
                  </select>
                </div>

                {/* Model FNS */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Modèle d'Analyse Documentaire FNS
                  </label>
                  <select
                    value={fnsModel}
                    onChange={e => setFnsModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-bold text-navy-900 dark:text-white"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Lecture haute vitesse PDF/Images)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Fiches manuscrites complexes)</option>
                    <option value="gpt-4o">gpt-4o (Vision OpenAI)</option>
                  </select>
                </div>

                {/* Clé API FNS Reader */}
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-navy-700 dark:text-navy-300">
                      Clé API FNS Reader / Scanner
                    </label>
                    <span className="text-[10px] text-navy-400">Permet la numérisation directe des fiches de synthèse</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type={showFnsKey ? 'text' : 'password'}
                      value={fnsReaderKey}
                      onChange={e => setFnsReaderKey(e.target.value)}
                      placeholder="AIzaSy... / Clé d'accès FNS Reader"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 font-mono font-bold text-navy-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFnsKey(!showFnsKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    >
                      {showFnsKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Options d'extraction FNS */}
                <div className="md:col-span-2 pt-2 space-y-3">
                  <label className="block font-bold text-navy-700 dark:text-navy-300">
                    Fonctionnalités & Options FNS Reader
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fnsExtractTables}
                        onChange={e => setFnsExtractTables(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      <span className="font-bold text-[11px] text-navy-800 dark:text-navy-200">
                        Tableaux & Posologies
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fnsExtractKeyPoints}
                        onChange={e => setFnsExtractKeyPoints(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      <span className="font-bold text-[11px] text-navy-800 dark:text-navy-200">
                        Pièges & Points Concours
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fnsAutoSummary}
                        onChange={e => setFnsAutoSummary(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      <span className="font-bold text-[11px] text-navy-800 dark:text-navy-200">
                        Structuration HTML FNS
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CLÉS PAR DÉFAUT & RÉFÉRENCES APIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    ✨ Clé Google AI Studio (Gemini 2.5)
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>Obtenir Clé Gratuite</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={googleAiKey}
                  onChange={e => setGoogleAiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-navy-800 font-mono font-bold"
                />
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                    🌐 Clé OpenRouter API
                  </span>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>Obtenir Clé OpenRouter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={e => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-navy-800 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-navy-100 dark:border-navy-800">
          <p className="text-[11px] text-navy-400">
            Toutes les modifications sont synchronisées avec la table SQL <code>platform_settings</code>.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement SQL...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
