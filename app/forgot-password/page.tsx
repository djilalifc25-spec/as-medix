'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Loader2,
  KeyRound, ShieldCheck, Eye, EyeOff, MessageCircle, Phone, ExternalLink, Sparkles
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [showManualReset, setShowManualReset] = useState(false);

  // Dynamic Platform Settings (WhatsApp, secondary phone, etc.)
  const [adminPhone, setAdminPhone] = useState('+213 555 12 34 56');
  const [adminDigits, setAdminDigits] = useState('213555123456');
  const [secondaryPhone, setSecondaryPhone] = useState('+213 770 12 34 56');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          if (d.settings.whatsappNumber) setAdminPhone(d.settings.whatsappNumber);
          if (d.settings.whatsappDigits) setAdminDigits(d.settings.whatsappDigits);
          if (d.settings.secondaryPhone) setSecondaryPhone(d.settings.secondaryPhone);
        }
      })
      .catch(() => {});
  }, []);

  // Step 1: Send request, generate WhatsApp message, and open WhatsApp directly
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche du compte');
      }

      const studentName = data.user?.name || email.split('@')[0];
      setUserName(studentName);
      setGeneratedCode(data.code || '');
      setResetUrl(data.resetUrl || '');

      // Build official WhatsApp message
      const text = `Bonjour Dr. Administrateur,

Je souhaite réinitialiser mon mot de passe sur AS-MEDIX.
• Mon Email : ${email.trim()}
• Nom du compte : ${studentName}

Merci de bien vouloir me transmettre mes accès.`;

      const targetDigits = adminDigits || '213555123456';
      const waLink = `https://wa.me/${targetDigits}?text=${encodeURIComponent(text)}`;
      setWhatsappUrl(waLink);

      // Open WhatsApp directly in new tab/app
      if (typeof window !== 'undefined') {
        window.open(waLink, '_blank');
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 (Optional manual): Confirm code and save new password directly
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('Le nouveau mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          newPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Code invalide ou expiré');
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4fd] dark:bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-navy-950 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Logo size="lg" showTagline={true} />
        <h2 className="mt-4 text-2xl font-black tracking-tight text-navy-950 dark:text-white">
          {step === 1 && "Mot de passe oublié"}
          {step === 2 && "Demande transmise sur WhatsApp"}
          {step === 3 && "Mot de passe réinitialisé !"}
        </h2>
        <p className="text-xs sm:text-sm text-navy-500 max-w-sm mx-auto">
          {step === 1 && "Entrez votre email pour être mis en relation directe avec l'administrateur sur WhatsApp"}
          {step === 2 && "Votre demande a été préparée pour l'administrateur qui vous fournira vos accès"}
          {step === 3 && "Votre compte est immédiatement accessible avec vos nouveaux identifiants"}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="apple-card p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(110,86,207,0.15)] space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ===================== ÉTAPE 1 : SAISIE DE L'EMAIL ===================== */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1.5">
                  Votre adresse email enregistrée :
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ex : dr.amine@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Assistance Directe & Instantanée par WhatsApp</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  En cliquant ci-dessous, WhatsApp s'ouvrira directement avec un message prêt à l'envoi vers l'administrateur (<strong>{adminPhone}</strong>). L'administrateur vous répondra immédiatement avec vos accès.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                <span>{loading ? 'Connexion en cours...' : 'Envoyer un message à l\'Admin sur WhatsApp'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ===================== ÉTAPE 2 : CONFIRMATION WHATSAPP & SECURS ===================== */}
          {step === 2 && (
            <div className="space-y-4 text-xs animate-fadeIn">
              {/* WhatsApp Action Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
                  <MessageCircle className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-bold text-navy-950 dark:text-white text-sm">
                    Votre message WhatsApp est prêt !
                  </h3>
                  <p className="text-[11px] text-navy-600 dark:text-navy-300 mt-1">
                    Compte : <strong>{userName}</strong> ({email})
                  </p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ouvrir WhatsApp ({adminPhone})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {secondaryPhone && (
                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-navy-500">
                    <Phone className="w-3 h-3 text-navy-400" />
                    <span>Autre numéro d'appel : <strong>{secondaryPhone}</strong></span>
                  </div>
                )}
              </div>

              {/* Accordion / Option to reset manually on screen */}
              <div className="pt-2 border-t border-navy-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowManualReset(!showManualReset)}
                  className="w-full text-center text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showManualReset ? 'Masquer la réinitialisation manuelle' : 'Ou réinitialiser vous-même directement avec le code instantané'}</span>
                </button>
              </div>

              {showManualReset && (
                <form onSubmit={handleConfirmReset} className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 space-y-3.5 animate-fadeIn">
                  {generatedCode && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-[11px]">
                      <span>Code généré : <strong className="font-mono text-amber-700 dark:text-amber-300">{generatedCode}</strong></span>
                      <button
                        type="button"
                        onClick={() => setCode(generatedCode)}
                        className="text-[10px] font-bold text-amber-800 underline cursor-pointer"
                      >
                        Insérer
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                      Code de vérification (6 chiffres) :
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="ex : 849201"
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-center tracking-widest font-mono font-bold text-base text-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                      Nouveau mot de passe :
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-9 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                      Confirmer le mot de passe :
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#6e56cf] hover:bg-[#7c3aed] text-white transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Validation...' : 'Enregistrer mon nouveau mot de passe'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ===================== ÉTAPE 3 : SUCCÈS ===================== */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-navy-950 dark:text-white text-lg">
                Mot de passe mis à jour avec succès !
              </h3>
              <p className="text-xs text-navy-600 dark:text-navy-400 leading-relaxed max-w-xs mx-auto">
                Votre nouveau mot de passe est immédiatement actif. Vous pouvez vous connecter à votre compte AS-MEDIX dès maintenant.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { window.location.href = '/login'; }}
                  className="w-full py-3.5 rounded-full text-sm font-bold bg-[#6e56cf] hover:bg-[#7c3aed] text-white shadow-soft transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Se connecter à AS-MEDIX</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
