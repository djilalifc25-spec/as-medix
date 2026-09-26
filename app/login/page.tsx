'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [deviceReasonNotice, setDeviceReasonNotice] = useState<string | null>(null);

  // Check if already logged in or if logged out due to single device restriction
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get('reason');
      if (reason === 'another_device' || reason === 'session_expired') {
        setDeviceReasonNotice('⚠️ Déconnexion Automatique : Votre compte s\'est connecté sur un autre appareil. Conformément au règlement d\'accès AS-MEDIX, un seul appareil peut être actif à la fois.');
      }
    }

    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('asmedix_logged_in');
      }
      setCurrentUser(null);
      router.refresh();
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identifiants incorrects');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('asmedix_logged_in', 'true');
      }

      const targetUrl = (data.user?.role === 'ADMIN' || data.user?.role === 'SUPER_ADMIN') ? '/admin' : '/dashboard';
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      } else {
        router.push(targetUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#f3f4fd] dark:bg-navy-950 flex flex-col justify-center py-8 pb-20 sm:py-12 px-4 sm:px-6 lg:px-8 text-navy-950 dark:text-white"
      style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center mb-1">
          <Logo size="lg" showTagline={true} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-navy-950 dark:text-white">
          Bienvenue sur AS MEDIX
        </h2>
        <p className="text-xs sm:text-sm text-navy-500">
          Connectez-vous pour reprendre vos révisions et vos QCM
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="apple-card p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(110,86,207,0.15)] space-y-6">
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-900 dark:text-brand-200">
                  Déjà connecté : <strong className="text-brand-600 dark:text-brand-400">{currentUser.name}</strong> ({currentUser.role})
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const dest = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
                    window.location.href = dest;
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#6e56cf] hover:bg-[#7c3aed] text-white font-bold text-center transition-colors"
                >
                  Ouvrir mon espace →
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleLogout();
                    window.location.reload();
                  }}
                  className="py-1.5 px-3 rounded-xl border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-300 font-bold hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}

          {deviceReasonNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{deviceReasonNotice}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-navy-700 dark:text-navy-300 mb-1.5">
                Nom d'utilisateur / Email :
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="ex : amine_med ou demo@asmedix.com"
                className="w-full px-4 py-3 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold uppercase text-navy-700 dark:text-navy-300">
                  Mot de passe :
                </label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-brand-600 hover:underline">
                  Oublié ?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-bold bg-[#6e56cf] hover:bg-[#7c3aed] text-white shadow-[0_8px_20px_rgba(110,86,207,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accès */}
          <div className="pt-4 border-t border-navy-100 dark:border-navy-800 space-y-2">
            <span className="text-[11px] font-bold text-navy-400 block text-center uppercase tracking-wider">
              Accès Démo 1-Clic :
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setIdentifier('amine_med'); setPassword('demo1234'); }}
                className="p-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 font-bold hover:border-brand-500 text-center"
              >
                👨‍⚕️ Étudiant (Amine)
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier('admin@asmedix.com'); setPassword('admin1234'); }}
                className="p-2.5 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 text-brand-700 dark:text-brand-300 font-bold hover:bg-brand-50 text-center"
              >
                ⚙️ Admin Master
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-navy-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-bold text-brand-600 hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
