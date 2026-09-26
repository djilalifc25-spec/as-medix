'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard, ShieldCheck, CheckCircle2, Copy, Send, ArrowLeft,
  Building2, Smartphone, AlertCircle, FileText, Check, Upload, Loader2, Crown, Star
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan')?.toUpperCase() === 'PREMIUM' ? 'PREMIUM' : 'PRO';
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'PREMIUM'>(initialPlan);
  const [proPrice, setProPrice] = useState(4500);
  const [premiumPrice, setPremiumPrice] = useState(7000);
  const price = selectedPlan === 'PREMIUM' ? `${premiumPrice.toLocaleString('fr-FR')} DA` : `${proPrice.toLocaleString('fr-FR')} DA`;

  const [paymentMethod, setPaymentMethod] = useState<'BaridiMob' | 'CCP'>('BaridiMob');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [notes, setNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [ripNumber, setRipNumber] = useState('00799999002233445566');
  const [ccpNumber, setCcpNumber] = useState('22334455 Clé 66');
  const [accountHolder, setAccountHolder] = useState('Dr. Karim Benali');
  const [adminPhone, setAdminPhone] = useState('+213 555 12 34 56');
  const [adminDigits, setAdminDigits] = useState('213555123456');

  React.useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          if (d.settings.baridimobRip) setRipNumber(d.settings.baridimobRip);
          if (d.settings.ccpNumber) setCcpNumber(d.settings.ccpNumber);
          if (d.settings.accountHolder) setAccountHolder(d.settings.accountHolder);
          if (d.settings.whatsappNumber) setAdminPhone(d.settings.whatsappNumber);
          if (d.settings.whatsappDigits) setAdminDigits(d.settings.whatsappDigits);
          if (d.settings.pricing?.proPriceDa) setProPrice(d.settings.pricing.proPriceDa);
          if (d.settings.pricing?.premiumPriceDa) setPremiumPrice(d.settings.pricing.premiumPriceDa);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const safeBlob = new Blob([buffer], { type: file.type || 'image/jpeg' });
      const safeName = (file.name || 'receipt').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const formData = new FormData();
      formData.append('file', safeBlob, safeName);
      formData.append('folder', 'receipts');

      const res = await fetch('/api/payment/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Échec du téléversement du reçu');
      }

      setReceiptUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de l\'envoi de la photo.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUrl) {
      setErrorMessage('Veuillez joindre la photo ou capture de votre reçu de versement CCP / BaridiMob.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          transactionRef: receiptUrl ? 'Capture jointe' : `REC-${Date.now().toString().slice(-6)}`,
          requestedPlan: selectedPlan,
          receiptUrl: receiptUrl || undefined,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de la demande.');
      }

      setSuccessMessage('Votre reçu de virement a été transmis à l\'administration. Votre forfait sera activé dès vérification !');
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-brand-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux forfaits</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
          Activation du Forfait {selectedPlan} ({price})
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 mt-1">
          Effectuez votre virement par BaridiMob ou CCP puis soumettez la référence pour validation par l'administration.
        </p>
      </div>

      {successMessage ? (
        <div className="apple-card p-8 text-center space-y-4 border-2 border-emerald-500">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            🎉
          </div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">
            Demande de Forfait Transmise avec Succès !
          </h2>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 max-w-md mx-auto leading-relaxed">
            {successMessage}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/dashboard"
              className="apple-badge-purple px-6 py-3 text-xs font-bold"
            >
              Retourner au Tableau de Bord
            </Link>
            <a
              href={`https://wa.me/${adminDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2"
            >
              <span>Envoyer Reçu par WhatsApp ({adminPhone})</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Payment Info Card */}
          <div className="md:col-span-3 space-y-6">
            {/* Plan selection selector (PRO or PREMIUM) */}
            <div className="apple-card p-5 space-y-3">
              <h3 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider">
                1. Choisissez votre forfait :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PRO */}
                <div
                  onClick={() => setSelectedPlan('PRO')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'PRO'
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
                      Pack PRO
                    </span>
                    <span className="text-xs font-black text-navy-950 dark:text-white">4 500 DA<span className="text-[10px] font-normal text-navy-400">/an</span></span>
                  </div>
                  <p className="text-[10.5px] text-navy-600 dark:text-navy-300 leading-snug">
                    Tous les cours, QCM illimités, annales et CAT urgences.
                  </p>
                </div>

                {/* PREMIUM */}
                <div
                  onClick={() => setSelectedPlan('PREMIUM')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'PREMIUM'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-500/20'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      Pack PREMIUM VIP
                    </span>
                    <span className="text-xs font-black text-navy-950 dark:text-white">7 000 DA<span className="text-[10px] font-normal text-navy-400">/an</span></span>
                  </div>
                  <p className="text-[10.5px] text-navy-600 dark:text-navy-300 leading-snug">
                    Pack PRO + Assistant IA 24/7 et cas cliniques progressifs.
                  </p>
                </div>
              </div>
            </div>

            {/* Method selector */}
            <div className="apple-card p-6 space-y-4">
              <h3 className="text-sm font-black text-navy-950 dark:text-white uppercase tracking-wider text-xs">
                2. Choisissez votre mode de paiement :
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BaridiMob')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'BaridiMob'
                      ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-700 dark:text-navy-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-5 h-5 text-brand-600" />
                    {paymentMethod === 'BaridiMob' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">BaridiMob (RIP)</div>
                    <div className="text-[10px] opacity-75">Instantané 24h/24</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CCP')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'CCP'
                      ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                      : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-700 dark:text-navy-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    {paymentMethod === 'CCP' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">Virement CCP</div>
                    <div className="text-[10px] opacity-75">Bureau d'Algérie Poste</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Official Account Details */}
            <div className="apple-card p-6 space-y-4 border-l-4 border-l-brand-600">
              <h3 className="text-xs font-black uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>3. Coordonnées Officielles de l'Administration :</span>
              </h3>

              <div className="space-y-3 bg-navy-50/80 dark:bg-navy-950/60 p-4 rounded-2xl border border-navy-100 dark:border-navy-800 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-navy-400">Titulaire du compte :</span>
                  <div className="font-bold text-navy-950 dark:text-white text-sm">{accountHolder}</div>
                </div>

                {paymentMethod === 'BaridiMob' ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-navy-400">Numéro RIP (BaridiMob) :</span>
                    <div className="flex items-center justify-between mt-0.5 bg-white dark:bg-navy-900 p-2.5 rounded-xl border border-navy-200 dark:border-navy-700 font-mono font-bold text-navy-950 dark:text-white">
                      <span>{ripNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(ripNumber, 'rip')}
                        className="text-brand-600 dark:text-brand-400 text-[11px] font-bold flex items-center gap-1 hover:underline"
                      >
                        {copiedField === 'rip' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'rip' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-navy-400">Numéro de Compte CCP :</span>
                    <div className="flex items-center justify-between mt-0.5 bg-white dark:bg-navy-900 p-2.5 rounded-xl border border-navy-200 dark:border-navy-700 font-mono font-bold text-navy-950 dark:text-white">
                      <span>{ccpNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(ccpNumber, 'ccp')}
                        className="text-brand-600 dark:text-brand-400 text-[11px] font-bold flex items-center gap-1 hover:underline"
                      >
                        {copiedField === 'ccp' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'ccp' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="apple-card p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-navy-950 dark:text-white">
                4. Soumettez votre Reçu :
              </h3>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Receipt photo upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-navy-700 dark:text-navy-300 flex items-center justify-between">
                  <span>Photo ou Capture du Reçu</span>
                  <span className="text-[10px] text-brand-600 font-semibold">Recommandé</span>
                </label>

                {receiptUrl ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">Reçu téléversé avec succès !</p>
                        <a href={receiptUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 dark:text-emerald-300 underline truncate block">
                          Voir la capture
                        </a>
                      </div>
                    </div>
                    <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border cursor-pointer hover:bg-slate-50 shrink-0">
                      Changer
                      <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-navy-200 dark:border-navy-700 hover:border-brand-500 bg-white/50 dark:bg-navy-900/50 cursor-pointer transition-all">
                    {uploadingReceipt ? (
                      <div className="flex flex-col items-center gap-1.5 py-2">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                        <span className="text-xs font-semibold text-brand-600">Téléversement du reçu en cours...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-1">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-600" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">
                          Cliquez pour joindre la capture BaridiMob / CCP
                        </span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, JPEG jusqu'à 10 Mo</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" disabled={uploadingReceipt} className="hidden" onChange={handleReceiptUpload} />
                  </label>
                )}
              </div>


              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy-700 dark:text-navy-300">
                  Note ou précision (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Précisez tout détail utile..."
                  className="w-full px-3.5 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmissions en cours...' : `Valider mon versement (${price})`}</span>
              </button>

              <p className="text-[10px] text-navy-400 text-center leading-tight">
                🔒 Validation manuelle sécurisée par le Dr. Admin sous 15 à 60 minutes.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-navy-400">Chargement de la page de paiement...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
