'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon, Mail, Award, Sparkles, Shield, Clock, CheckCircle2,
  BookOpen, Brain, Crown, Star, Rocket, Zap, LogOut, ChevronRight, Copy, Check
} from 'lucide-react';
import { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const plan = user?.plan || 'FREE';
  const isPro = plan === 'PRO';
  const isPremium = plan === 'PREMIUM';
  const isFree = !isPro && !isPremium;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#5D5FEF] via-indigo-600 to-[#4340C4] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                {user?.name || (loading ? 'Chargement...' : 'Docteur')}
              </h1>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                  <Crown className="w-3.5 h-3.5 fill-current" /> VIP PREMIUM
                </span>
              ) : isPro ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-[#5D5FEF] dark:text-indigo-300 border border-indigo-500/40">
                  <Star className="w-3.5 h-3.5 fill-current" /> MEMBRE PRO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  <Rocket className="w-3.5 h-3.5" /> VERSION DÉMO
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{user?.email || 'Étudiant en Médecine'}</span>
              <span>•</span>
              <span>{user?.faculty === 'ORAN' ? 'Faculté d\'Oran' : user?.faculty === 'SIDI_BEL_ABBES' ? 'Faculté de SBA' : 'Algérie'}</span>
            </p>
          </div>
        </div>

        {isFree ? (
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Choisir un Forfait (PRO ou VIP)</span>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Abonnement Actif</span>
          </div>
        )}
      </div>

      {/* Subscription Tier Status Banner */}
      <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${
        isPremium
          ? 'bg-gradient-to-br from-amber-900/40 via-slate-900 to-amber-950/40 border-amber-500/30 text-white'
          : isPro
          ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border-indigo-500/30 text-white'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white'
      }`}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Statut du Compte
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-black flex items-center gap-2">
              {isPremium ? (
                <>👑 Accès VIP PREMIUM Illimité</>
              ) : isPro ? (
                <>⭐ Forfait PRO Concours Résidanat 2026</>
              ) : (
                <>🚀 Compte Démo Gratuite</>
              )}
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {isPremium
                ? 'Vous disposez d\'un accès intégral 365 jours à l\'ensemble des 20 spécialités, annales, cas cliniques et protocoles de Garde H24.'
                : isPro
                ? 'Votre compte PRO est actif avec déblocage complet de tous les QCM, fiches de révision et entraînements intensifs.'
                : 'Votre compte d\'essai est actif. Choisissez le forfait PRO ou PREMIUM pour déverrouiller l\'ensemble des modules et QCMs.'}
            </p>
          </div>

          {isFree && (
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-lg shadow-amber-500/25 shrink-0 text-center active:scale-95 transition-all"
            >
              ⚡ Choisir mon Forfait (PRO ou VIP)
            </Link>
          )}
        </div>
      </div>

      {/* Account Details Info Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-[#5D5FEF]" />
          <span>Informations Détaillées du Compte</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nom & Prénom</span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Docteur'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Adresse E-mail</span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.email || 'Non renseignée'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculté de Rattachement</span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {user?.faculty === 'ORAN' ? '☀️ Faculté de Médecine d\'Oran' : user?.faculty === 'SIDI_BEL_ABBES' ? '🌿 Faculté de Médecine SBA' : '🇩🇿 National (Toutes facultés)'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type de Forfait</span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              {isPremium ? '👑 PREMIUM (Accès Annuel VIP)' : isPro ? '⭐ PRO (Accès Annuel Résidanat)' : '🚀 DÉMO (Version Gratuite)'}
            </p>
          </div>
        </div>
      </div>

      {/* BaridiMob & CCP Coordinates for Easy Upgrade */}
      {isFree && (
        <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Coordonnées de Règlement pour Activation PRO</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* BaridiMob */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-700/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">BaridiMob RIP</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">00799999002233445566</span>
              </div>
              <button
                onClick={() => handleCopy('00799999002233445566', 'rip')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-amber-600 dark:text-amber-400 transition-all"
                title="Copier le RIP"
              >
                {copiedField === 'rip' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* CCP */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-700/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">CCP & Clé</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">22334455 Clé 66</span>
              </div>
              <button
                onClick={() => handleCopy('22334455 Clé 66', 'ccp')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-amber-600 dark:text-amber-400 transition-all"
                title="Copier le CCP"
              >
                {copiedField === 'ccp' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Link
              href="/checkout?plan=PRO"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm text-center transition-all"
            >
              Envoyer mon reçu de versement
            </Link>
            <a
              href="https://wa.me/213555000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm text-center transition-all"
            >
              Envoyer le reçu sur WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Quick Navigation & Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
        <Link
          href="/reminders"
          className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5D5FEF]">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Mes Rappels & Pièges</span>
              <span className="text-[11px] text-slate-400">Consulter vos notions répétées et vos pièges corrigés</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/progression"
          className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Ma Progression Résidanat</span>
              <span className="text-[11px] text-slate-400">Scores des QCMs, statistiques de révision et objectifs</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/contact"
          className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Support & Assistance</span>
              <span className="text-[11px] text-slate-400">Contacter l'équipe pédagogique AS MEDIX</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold block">Déconnexion de la session</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
