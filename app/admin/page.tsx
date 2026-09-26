'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, DollarSign, BookOpen, Brain, TrendingUp, Sparkles,
  ShieldCheck, AlertCircle, ArrowUpRight, Plus, Eye, Siren,
  CreditCard, CheckCircle2, UserCheck, RefreshCw, Database
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    premiumUsers: 0,
    totalSubscribers: 0,
    monthlyRevenueDa: 0,
    coursesCount: 0,
    qcmsCount: 0,
    catCount: 36,
    pendingPaymentsCount: 0
  });
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'subscribers'>('all');
  const [upgradingId, setUpgradingId] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setSubscribers(data.subscribers || []);
        setRecentUsers(data.recentUsers || []);
        setIsSupabaseLive(data.isSupabaseLive);
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUpgrade = async (id: string, newPlan: 'PRO' | 'PREMIUM') => {
    setUpgradingId(id);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'update', updates: { plan: newPlan } })
      });
      await fetchStats();
    } catch (e) {
      console.error('Failed to upgrade user', e);
    } finally {
      setUpgradingId(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const freePercentage = stats.totalUsers > 0 ? Math.round((stats.freeUsers / stats.totalUsers) * 100) : 0;
  const proPercentage = stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0;
  const premiumPercentage = stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseLive ? 'Connecté à Supabase (PostgreSQL)' : 'Mode Stockage Sécurisé'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 mt-1">
            Gestion en direct des comptes utilisateurs, abonnés payants réels et métriques de la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-300 hover:text-brand-600 hover:border-brand-300 transition-all"
            title="Rafraîchir les métriques"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/cours/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un cours médical</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (REAL DATA) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-400">Total Inscrits</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-navy-950 dark:text-white mt-1">
            {loading ? '...' : stats.totalUsers}
          </div>
          <div className="text-[11px] text-navy-500 font-medium mt-1">
            {stats.freeUsers} Gratuits • {stats.totalSubscribers} Abonnés
          </div>
        </div>

        {/* Real Subscribers & MRR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-400">Abonnés Payants Réels</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {loading ? '...' : stats.totalSubscribers}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold mt-1">
            PRO: {stats.proUsers} • PREMIUM: {stats.premiumUsers}
          </div>
        </div>

        {/* Real MRR in DA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-400">Revenus Mensuels Réels</span>
            <DollarSign className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {loading ? '...' : stats.monthlyRevenueDa.toLocaleString()} DA
          </div>
          <div className="text-[11px] text-navy-500 mt-1">Calculé sur abonnements actifs</div>
        </div>

        {/* Medical Content */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-400">Contenu Médical</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-navy-950 dark:text-white mt-1">
            {stats.catCount} CAT
          </div>
          <div className="text-[11px] text-navy-500 mt-1">
            {stats.coursesCount} Cours • {stats.qcmsCount} QCM
          </div>
        </div>
      </div>

      {/* Subscription Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subscription Distribution */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-950 dark:text-white">
                Répartition Réelle des Utilisateurs
              </h2>
              <p className="text-xs text-navy-500">Comptes isolés et étanches</p>
            </div>
            <span className="text-xs font-bold text-brand-600">
              Total : {stats.totalUsers} comptes
            </span>
          </div>

          {/* Graphical Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-navy-700 dark:text-navy-300">Comptes GRATUITS (0 DA)</span>
                <span>{stats.freeUsers} utilisateurs ({freePercentage}%)</span>
              </div>
              <div className="w-full h-3 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div style={{ width: `${freePercentage}%` }} className="h-full bg-navy-400 rounded-full transition-all duration-500"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-brand-600">Abonnés PRO Résidanat (4 500 DA)</span>
                <span>{stats.proUsers} abonnés ({proPercentage}%)</span>
              </div>
              <div className="w-full h-3 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div style={{ width: `${proPercentage}%` }} className="h-full bg-brand-600 rounded-full transition-all duration-500"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-500">Abonnés PREMIUM Clinique (7 000 DA)</span>
                <span>{stats.premiumUsers} abonnés ({premiumPercentage}%)</span>
              </div>
              <div className="w-full h-3 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div style={{ width: `${premiumPercentage}%` }} className="h-full bg-amber-400 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-950 dark:text-white">
            Actions d'Administration
          </h2>
          <div className="space-y-2 text-xs">
            <Link
              href="/admin/paiements"
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <span>💳 Validation Reçus BaridiMob / CCP</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-600 text-white font-bold">
                {stats.pendingPaymentsCount}
              </span>
            </Link>

            <Link
              href="/admin/utilisateurs"
              className="p-3 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 flex items-center justify-between font-bold text-navy-800 dark:text-white hover:bg-navy-100 transition-colors"
            >
              <span>Gérer les comptes utilisateurs ({stats.totalUsers})</span>
              <ArrowUpRight className="w-4 h-4 text-navy-400" />
            </Link>

            <Link
              href="/admin/cat"
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between font-bold text-rose-900 dark:text-rose-200 hover:bg-rose-100 transition-colors"
            >
              <span>Gérer les 36 Conduites à Tenir</span>
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </Link>

            <Link
              href="/admin/cours"
              className="p-3 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 flex items-center justify-between font-bold text-navy-800 dark:text-white hover:bg-navy-100 transition-colors"
            >
              <span>Gérer les cours médicaux ({stats.coursesCount})</span>
              <ArrowUpRight className="w-4 h-4 text-navy-400" />
            </Link>

            <Link
              href="/admin/parametres"
              className="p-3 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 flex items-center justify-between font-bold text-navy-800 dark:text-white hover:bg-navy-100 transition-colors"
            >
              <span>Configurer quotas FREE & Tarifs DA</span>
              <ArrowUpRight className="w-4 h-4 text-navy-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* DEDICATED SEPARATE TABLE: Real Users & Paid Subscribers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-100 dark:border-navy-800">
          <div>
            <h2 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>Membres Inscrits & Abonnés Supabase Cloud</span>
            </h2>
            <p className="text-xs text-navy-500">
              Chaque inscription mobile ou PC est synchronisée en temps réel dans votre base Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex p-1 rounded-xl bg-navy-100 dark:bg-navy-800">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                }`}
              >
                Tous les Inscrits ({recentUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'subscribers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                }`}
              >
                Abonnés Payants ({subscribers.length})
              </button>
            </div>

            <Link
              href="/admin/utilisateurs"
              className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Gérer tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TAB 1: ALL REGISTERED MEMBERS (INCLUDING MOBILE SIGNUPS) */}
        {activeTab === 'all' && (
          <div>
            {recentUsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-navy-500 italic">
                Aucun utilisateur inscrit.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-navy-400 border-b border-navy-100 dark:border-navy-800 pb-2">
                      <th className="py-2.5 font-bold">Médecin / Étudiant</th>
                      <th className="py-2.5 font-bold">Email</th>
                      <th className="py-2.5 font-bold">Profession</th>
                      <th className="py-2.5 font-bold">Faculté</th>
                      <th className="py-2.5 font-bold">Forfait Actuel</th>
                      <th className="py-2.5 font-bold">Date d'inscription</th>
                      <th className="py-2.5 font-bold text-right">Action Rapide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 dark:divide-navy-800/60">
                    {recentUsers.map((user, idx) => {
                      const isPaid = user.plan === 'PRO' || user.plan === 'PREMIUM';
                      return (
                        <tr key={user.id || idx} className="hover:bg-slate-50 dark:hover:bg-navy-800/40 transition-colors">
                          <td className="py-3 font-bold text-navy-950 dark:text-white flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-black flex items-center justify-center shrink-0">
                              {user.name?.charAt(0).toUpperCase() || 'D'}
                            </span>
                            <span className="truncate max-w-[150px] sm:max-w-none">{user.name}</span>
                          </td>
                          <td className="py-3 text-navy-600 dark:text-navy-300 font-mono text-[11px]">{user.email}</td>
                          <td className="py-3 text-navy-500 font-medium">{user.profession || user.role}</td>
                          <td className="py-3 text-navy-500">{user.faculty || 'ORAN'}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              user.plan === 'PREMIUM'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                : user.plan === 'PRO'
                                ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-300 dark:border-brand-700'
                                : 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-navy-300 border border-slate-200 dark:border-navy-700'
                            }`}>
                              {user.plan || 'FREE (Démo)'}
                            </span>
                          </td>
                          <td className="py-3 text-navy-400 text-[11px]">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Récemment'}
                          </td>
                          <td className="py-3 text-right">
                            {!isPaid ? (
                              <button
                                type="button"
                                disabled={upgradingId === user.id}
                                onClick={() => handleQuickUpgrade(user.id, 'PRO')}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                              >
                                {upgradingId === user.id ? 'Activation...' : '⚡ Activer PRO'}
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE PAID SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div>
            {subscribers.length === 0 ? (
              <div className="py-8 text-center text-xs text-navy-500 italic">
                Aucun abonné payant pour le moment. Activez un forfait PRO sur la liste ci-dessus ou validez un reçu BaridiMob.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-navy-400 border-b border-navy-100 dark:border-navy-800 pb-2">
                      <th className="py-2.5 font-bold">Abonné</th>
                      <th className="py-2.5 font-bold">Email</th>
                      <th className="py-2.5 font-bold">Téléphone</th>
                      <th className="py-2.5 font-bold">Forfait</th>
                      <th className="py-2.5 font-bold">Rôle</th>
                      <th className="py-2.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 dark:divide-navy-800/60">
                    {subscribers.map((sub, idx) => {
                      const isPro = sub.plan === 'PRO';
                      return (
                        <tr key={sub.id || idx} className="hover:bg-slate-50 dark:hover:bg-navy-800/40 transition-colors">
                          <td className="py-3 font-bold text-navy-950 dark:text-white flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-black flex items-center justify-center">
                              {sub.name?.charAt(0).toUpperCase()}
                            </span>
                            <span>{sub.name}</span>
                          </td>
                          <td className="py-3 text-navy-600 dark:text-navy-300 font-mono text-[11px]">{sub.email}</td>
                          <td className="py-3 text-navy-600 dark:text-navy-300 font-mono text-[11px]">{sub.phone}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isPro
                                ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {sub.plan} ({isPro ? '4 500 DA' : '7 000 DA'})
                            </span>
                          </td>
                          <td className="py-3 text-navy-500 font-medium">{sub.profession || sub.role}</td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/admin/utilisateurs?search=${encodeURIComponent(sub.email)}`}
                              className="px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:text-brand-600 text-[11px] font-bold"
                            >
                              Gérer
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
