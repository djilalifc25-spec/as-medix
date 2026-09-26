'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, CreditCard,
  Smartphone, Building2, Copy, Check, Upload, ExternalLink, Sparkles,
  MessageCircle, Instagram, Mail, FileText, Loader2, ArrowLeft, Star
} from 'lucide-react';
import { MedicalProfession, PlanType, User } from '@/types';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = (searchParams.get('plan') as PlanType) || 'FREE';

  // Step state: 1 = Register form, 2 = Plan selection & Payment proof upload
  const [step, setStep] = useState<1 | 2>(1);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  // Form fields
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState<MedicalProfession>('Étudiant');
  const [faculty, setFaculty] = useState<'ORAN' | 'SIDI_BEL_ABBES' | 'TOUS'>('ORAN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 2 payment fields
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'PREMIUM'>('PRO');
  const [paymentMethod, setPaymentMethod] = useState<'BaridiMob' | 'CCP'>('BaridiMob');
  const [transactionRef, setTransactionRef] = useState('');
  const [phone, setPhone] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const receiptInputRef = useRef<HTMLInputElement>(null);

  // Payment coordinates & contact settings (dynamically fetched from platform_settings)
  const [ripNumber, setRipNumber] = useState('00799999002233445566');
  const [ccpNumber, setCcpNumber] = useState('22334455 Clé 66');
  const [accountHolder, setAccountHolder] = useState('Dr. Karim Benali');
  const [adminDigits, setAdminDigits] = useState('213555123456');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/asmedix_officiel');
  const [supportEmail, setSupportEmail] = useState('contact@asmedix.dz');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          if (d.settings.baridimobRip) setRipNumber(d.settings.baridimobRip);
          if (d.settings.ccpNumber) setCcpNumber(d.settings.ccpNumber);
          if (d.settings.accountHolder) setAccountHolder(d.settings.accountHolder);
          if (d.settings.whatsappDigits) setAdminDigits(d.settings.whatsappDigits);
          if (d.settings.instagramUrl) setInstagramUrl(d.settings.instagramUrl);
          if (d.settings.supportEmail) setSupportEmail(d.settings.supportEmail);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Step 1: Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          username: username || email.split('@')[0],
          password,
          profession,
          faculty,
          targetPlan: 'FREE', // Start as FREE Demo, upgraded via Step 2
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription');

      if (typeof window !== 'undefined') {
        localStorage.setItem('asmedix_logged_in', 'true');
      }

      setCreatedUser(data.user);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload receipt to Supabase Storage
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    try {
      const preview = URL.createObjectURL(file);
      setLocalPreview(preview);
    } catch {}

    setUploadingReceipt(true);
    setUploadError(null);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const safeBlob = new Blob([buffer], { type: file.type || 'image/jpeg' });
      const safeName = (file.name || 'receipt').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const formData = new FormData();
      formData.append('file', safeBlob, safeName);
      formData.append('folder', 'receipts');

      const res = await fetch('/api/payment/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Échec du téléversement du reçu');
      }

      setReceiptUrl(data.url);
    } catch (err: any) {
      console.error('Receipt upload error:', err);
      setUploadError(err.message || 'Erreur lors du téléversement');
    } finally {
      setUploadingReceipt(false);
    }
  };

  // Step 2: Submit Payment proof
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setError('');

    let activeReceiptUrl = receiptUrl;

    // If file was selected but upload was pending or failed, auto-upload now
    if (!activeReceiptUrl && selectedFile) {
      setUploadingReceipt(true);
      try {
        const buffer = await selectedFile.arrayBuffer();
        const safeBlob = new Blob([buffer], { type: selectedFile.type || 'image/jpeg' });
        const safeName = (selectedFile.name || 'receipt').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_.-]/g, "_");
        const formData = new FormData();
        formData.append('file', safeBlob, safeName);
        formData.append('folder', 'receipts');
        const res = await fetch('/api/payment/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          activeReceiptUrl = data.url;
          setReceiptUrl(data.url);
        }
      } catch (uploadErr) {
        console.warn('Auto upload retry caught:', uploadErr);
      } finally {
        setUploadingReceipt(false);
      }
    }

    if (!transactionRef.trim() && !activeReceiptUrl && !selectedFile) {
      setError('Veuillez joindre la capture du virement ou renseigner le numéro de transaction.');
      return;
    }

    setSubmittingPayment(true);

    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          transactionRef: transactionRef.trim() || (selectedFile ? `Reçu: ${selectedFile.name}` : 'Reçu téléversé'),
          requestedPlan: selectedPlan,
          receiptUrl: activeReceiptUrl || (selectedFile ? `Fichier: ${selectedFile.name}` : undefined),
          userPhone: phone,
          userId: createdUser?.id,
          userEmail: createdUser?.email || email,
          userName: createdUser?.name || `${prenom} ${nom}`,
          notes: `Virement ${paymentMethod} transmis par Dr. ${createdUser?.name || nom}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la transmission');

      setPaymentSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const directWhatsAppMsg = encodeURIComponent(
    `Salam Alaikom AS-MEDIX, je viens de créer mon compte :\n- Nom : Dr. ${createdUser?.name || nom || 'Médecin'}\n- Email : ${createdUser?.email || email}\n- Forfait choisi : ${selectedPlan} (${selectedPlan === 'PREMIUM' ? '7 000 DA' : '4 500 DA'})\n- Mode : ${paymentMethod}\n- Réf : ${transactionRef || 'Ci-joint'}\nJe vous envoie la capture du virement.`
  );

  return (
    <div 
      className="min-h-screen bg-[#f3f4fd] dark:bg-navy-950 flex flex-col justify-center py-8 pb-24 sm:py-12 px-4 sm:px-6 lg:px-8 text-navy-950 dark:text-white"
      style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="flex justify-center mb-1">
          <Logo size="lg" showTagline={true} />
        </div>

        {/* Stepper indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-800 shadow-sm text-xs font-bold">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-brand-600 text-white' : 'bg-emerald-600 text-white'}`}>
            {step === 1 ? '1' : '✓'}
          </span>
          <span className={step === 1 ? 'text-brand-600' : 'text-navy-500'}>1. Inscription</span>
          <span className="text-navy-300">→</span>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-brand-600 text-white' : 'bg-navy-200 dark:bg-navy-800 text-navy-500'}`}>
            2
          </span>
          <span className={step === 2 ? 'text-brand-600 font-extrabold' : 'text-navy-400'}>2. Forfait & Activation</span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-navy-950 dark:text-white">
          {step === 1 ? "Rejoignez l'Excellence Médicale AS-MEDIX" : `Bienvenue Dr. ${createdUser?.name || prenom} !`}
        </h2>
        <p className="text-xs sm:text-sm text-navy-500 max-w-md mx-auto">
          {step === 1 
            ? 'Plateforme médicale algérienne de référence pour externat, résidanat et gardes médicales.' 
            : 'Votre compte démo est actif. Choisissez votre pack pour débloquer l\'intégralité des 36 CAT d\'urgence et cours.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="apple-card p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(110,86,207,0.15)] space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ======================= STEP 1: FORMULAIRE D'INSCRIPTION ======================= */}
          {step === 1 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Nom * :</label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="ex: Zerrouki"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Prénom * :</label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="ex: Amine"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Email personnel ou universitaire * :</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="amine.zerrouki@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Nom d'utilisateur * :</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="dr_amine"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Profession / Titre :</label>
                  <select
                    value={profession}
                    onChange={e => setProfession(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
                  >
                    <option value="Étudiant">Externe en médecine</option>
                    <option value="Interne">Interne des hôpitaux</option>
                    <option value="Médecin">Médecin Résident / Praticien</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Faculté de Médecine :</label>
                <select
                  value={faculty}
                  onChange={e => setFaculty(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-amber-50/60 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
                >
                  <option value="ORAN">🏛️ Faculté de Médecine d'Oran (Oran 1 - Chalabi)</option>
                  <option value="SIDI_BEL_ABBES">🏛️ Faculté de Médecine de Sidi Bel Abbès (Djillali Liabès)</option>
                  <option value="TOUS">🌐 Alger, Constantine, Annaba ou autre faculté</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Mot de passe secret * :</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-bold bg-[#6e56cf] hover:bg-[#7c3aed] text-white shadow-[0_8px_20px_rgba(110,86,207,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>{loading ? 'Création de votre compte...' : 'Continuer vers l\'étape 2 (Forfait)'}</span>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-navy-500">
                  Déjà inscrit ?{' '}
                  <Link href="/login" className="font-bold text-brand-600 hover:underline">
                    Se connecter directement
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* ======================= STEP 2: CHOIX DU FORFAIT & VIREMENT CCP / BARIDIMOB ======================= */}
          {step === 2 && !paymentSubmitted && (
            <div className="space-y-6 animate-fadeIn">
              {/* Connected Notice */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Compte Démo Actif : {createdUser?.name || `Dr. ${prenom} ${nom}`}
                    </p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                      Session connectée avec succès • Vous pouvez continuer ou choisir un pack ci-dessous
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { window.location.href = '/dashboard'; }}
                  className="w-full sm:w-auto py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap text-center"
                >
                  Ouvrir l'Espace Médical →
                </button>
              </div>

              {/* 1. Select Plan */}
              <div>
                <label className="block text-xs font-black uppercase text-navy-800 dark:text-white mb-2.5">
                  1. Choisissez votre forfait d'accès :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PRO Card */}
                  <div
                    onClick={() => setSelectedPlan('PRO')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'PRO'
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/30 shadow-md ring-2 ring-brand-500/20'
                        : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-brand-600 uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-brand-600" /> Pack PRO
                      </span>
                      <span className="text-sm font-black text-navy-950 dark:text-white">4 500 DA<span className="text-[10px] font-medium text-navy-400">/an</span></span>
                    </div>
                    <p className="text-[11px] text-navy-600 dark:text-navy-300 leading-snug">
                      • 36 CAT Urgences complètes<br />
                      • Tous les cours & QCMs corrigés<br />
                      • Tracés ECG & Protocoles de garde
                    </p>
                  </div>

                  {/* PREMIUM Card */}
                  <div
                    onClick={() => setSelectedPlan('PREMIUM')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'PREMIUM'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/20'
                        : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Pack PREMIUM
                      </span>
                      <span className="text-sm font-black text-navy-950 dark:text-white">7 000 DA<span className="text-[10px] font-medium text-navy-400">/an</span></span>
                    </div>
                    <p className="text-[11px] text-navy-600 dark:text-navy-300 leading-snug">
                      • Tout le contenu du Pack PRO<br />
                      • Cas cliniques interactifs illimités<br />
                      • IA Médicale AS-MEDIX 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Coordonnées BaridiMob & CCP */}
              <div className="p-4 rounded-2xl bg-navy-50/80 dark:bg-navy-900 border border-navy-200 dark:border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-navy-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-600" /> 2. Coordonnées officielles de versement :
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BaridiMob')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        paymentMethod === 'BaridiMob'
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                      }`}
                    >
                      BaridiMob
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CCP')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        paymentMethod === 'CCP'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                      }`}
                    >
                      Virement CCP
                    </button>
                  </div>
                </div>

                {paymentMethod === 'BaridiMob' ? (
                  <div className="p-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-navy-400">Numéro RIP BaridiMob :</p>
                      <p className="font-mono text-sm font-black text-navy-900 dark:text-white tracking-wider">
                        {ripNumber}
                      </p>
                      <p className="text-[10px] text-navy-500 mt-0.5">Titulaire : {accountHolder}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(ripNumber, 'rip')}
                      className="px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedField === 'rip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'rip' ? 'Copié !' : 'Copier RIP'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-navy-400">Compte CCP :</p>
                      <p className="font-mono text-sm font-black text-navy-900 dark:text-white tracking-wider">
                        {ccpNumber}
                      </p>
                      <p className="text-[10px] text-navy-500 mt-0.5">Titulaire : {accountHolder}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(ccpNumber, 'ccp')}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedField === 'ccp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'ccp' ? 'Copié !' : 'Copier CCP'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Preuve de paiement & Transmission */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-navy-800 dark:text-white mb-1.5">
                    3. Joindre capture BaridiMob ou photo du reçu CCP :
                  </label>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => receiptInputRef.current?.click()}
                        disabled={uploadingReceipt}
                        className="px-4 py-2.5 rounded-xl border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800 text-navy-800 dark:text-white font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {uploadingReceipt ? <Loader2 className="w-4 h-4 animate-spin text-brand-600" /> : <Upload className="w-4 h-4 text-brand-600" />}
                        <span>{uploadingReceipt ? 'Envoi du reçu...' : (selectedFile ? 'Changer la photo' : 'Choisir la photo / capture')}</span>
                      </button>
                      <input
                        ref={receiptInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />

                      {receiptUrl ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-4 h-4" /> Reçu synchronisé avec succès
                        </span>
                      ) : selectedFile ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                          {uploadingReceipt ? 'Téléversement...' : 'Photo prête pour validation'}
                        </span>
                      ) : null}
                    </div>

                    {uploadError && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        ⚠️ Note : {uploadError}. Vous pouvez tout de même valider ou renseigner la référence ci-dessous.
                      </p>
                    )}

                    {(receiptUrl || localPreview) && (
                      <div className="mt-2 p-2 rounded-xl bg-navy-50 dark:bg-navy-900 border border-navy-200 dark:border-navy-800 flex items-center gap-3">
                        <img 
                          src={receiptUrl || localPreview || ''} 
                          alt="Reçu" 
                          className="h-16 w-16 rounded-lg object-cover border border-navy-200 dark:border-navy-700 shrink-0" 
                        />
                        <div className="text-[11px] space-y-0.5 overflow-hidden">
                          <p className="font-bold text-navy-800 dark:text-navy-100 truncate">
                            {selectedFile?.name || 'Reçu de paiement'}
                          </p>
                          <p className="text-navy-400">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} Ko • Image prête` : 'Image validée'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                      Numéro / Référence de transaction :
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={e => setTransactionRef(e.target.value)}
                      placeholder="ex: BM-9823412 ou N° reçu CCP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                      Téléphone / WhatsApp pour confirmation :
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0555 12 34 56"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Confirmer mon versement et envoyer le reçu</span>
                </button>
              </form>

              {/* 4. Envoi Direct via WhatsApp / Instagram / Email */}
              <div className="pt-4 border-t border-navy-100 dark:border-navy-800 space-y-2.5">
                <p className="text-[11px] font-bold text-navy-500 text-center uppercase tracking-wider">
                  Ou transmettez votre capture directement par :
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/${adminDigits}?text=${directWhatsAppMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex flex-col items-center gap-1 transition-all text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </a>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex flex-col items-center gap-1 transition-all text-center"
                  >
                    <Instagram className="w-4 h-4 text-rose-600" />
                    <span className="text-[10px] font-bold">Instagram DM</span>
                  </a>

                  <a
                    href={`mailto:${supportEmail}?subject=Reçu de paiement AS-MEDIX - Dr. ${createdUser?.name || nom}&body=${directWhatsAppMsg}`}
                    className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 flex flex-col items-center gap-1 transition-all text-center"
                  >
                    <Mail className="w-4 h-4 text-sky-600" />
                    <span className="text-[10px] font-bold">Email Direct</span>
                  </a>
                </div>
              </div>

              {/* Skip to Free Demo link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { window.location.href = '/dashboard'; }}
                  className="text-xs font-bold text-navy-500 hover:text-navy-900 dark:hover:text-white underline cursor-pointer"
                >
                  Continuer sur mon compte Démo (Dr. {createdUser?.name || prenom}) en attendant la validation →
                </button>
              </div>
            </div>
          )}

          {/* ======================= STEP 2 CONFIRMED SUCCESS ======================= */}
          {step === 2 && paymentSubmitted && (
            <div className="text-center space-y-5 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-sm">
                🎉
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-navy-950 dark:text-white">
                  Reçu Transmis avec Succès !
                </h3>
                <p className="text-xs text-navy-600 dark:text-navy-300 max-w-sm mx-auto leading-relaxed">
                  Merci <strong>Dr. {createdUser?.name || prenom}</strong>. Votre preuve de versement BaridiMob / CCP a été enregistrée.
                  L'administrateur validera votre formule <strong>{selectedPlan}</strong> sous peu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs">
                💡 <strong>Votre compte est immédiatement accessible :</strong> vous pouvez dès à présent explorer la plateforme avec votre compte personnel.
              </div>

              <button
                type="button"
                onClick={() => { window.location.href = '/dashboard'; }}
                className="w-full py-3.5 rounded-2xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Accéder à mon tableau de bord médical</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-navy-400">Chargement...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

