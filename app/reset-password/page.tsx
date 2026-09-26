'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ArrowLeft, CheckCircle2, AlertCircle, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('Le mot de passe doit comporter au moins 4 caractères.');
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
          token,
          email,
          newPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation');
      }

      setSuccess(true);
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
          Nouveau Mot de Passe
        </h2>
        <p className="text-xs sm:text-sm text-navy-500">
          Choisissez un mot de passe sécurisé pour votre compte AS-MEDIX
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="apple-card p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(110,86,207,0.15)] space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {!token && (
                <div>
                  <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1.5">
                    Adresse email du compte :
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dr.amine@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1.5">
                  Nouveau mot de passe :
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1.5">
                  Confirmer le mot de passe :
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Mise à jour en cours...' : 'Enregistrer mon nouveau mot de passe'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-navy-950 dark:text-white">
                  Mot de passe mis à jour !
                </h3>
                <p className="text-xs text-navy-500 max-w-xs mx-auto">
                  Votre nouveau mot de passe est immédiatement actif. Vous pouvez vous connecter dès à présent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => { window.location.href = '/login'; }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Se connecter maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:underline"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-navy-400">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
