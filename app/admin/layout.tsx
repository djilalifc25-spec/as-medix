import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard, BookOpen, Brain, FileText, ShieldAlert, Activity, Pill,
  Users, Settings, ArrowLeft, ExternalLink, Sparkles, MessageSquare, CreditCard, Siren, Bell
} from 'lucide-react';

import { AdminNavHeader } from '@/components/admin/AdminNavHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // SECURITY GUARD: Only ADMIN and SUPER_ADMIN can access the Panel
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/dashboard?error=unauthorized_admin');
  }

  const navItems = [
    { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    { label: 'Notifications Flash', href: '/admin/notifications', icon: Bell },
    { label: 'Boîte de Réception', href: '/admin/messages', icon: MessageSquare },
    { label: 'Virements BaridiMob / CCP', href: '/admin/paiements', icon: CreditCard },
    { label: 'Protocoles Garde (HTML)', href: '/admin/garde', icon: Siren },
    { label: 'Spécialités & 6 Années', href: '/admin/specialites', icon: Sparkles },
    { label: 'Gestion des Cours', href: '/admin/cours', icon: BookOpen },
    { label: 'Banque QCM (HTML)', href: '/admin/qcm', icon: Brain },
    { label: 'Sources & Ouvrages', href: '/admin/sources', icon: BookOpen },
    { label: 'Fiches Flash (HTML)', href: '/admin/fiches', icon: FileText },
    { label: 'Conduite À Tenir (HTML)', href: '/admin/cat', icon: ShieldAlert },
    { label: 'Cas Cliniques (HTML)', href: '/admin/cas-cliniques', icon: Activity },
    { label: 'ECG du Jour (HTML/SVG)', href: '/admin/ecg', icon: Activity },
    { label: 'Pharmacopée DZ', href: '/admin/medicaments', icon: Pill },
    { label: 'Utilisateurs & Forfaits', href: '/admin/utilisateurs', icon: Users },
    { label: 'Paramètres & Contacts', href: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-navy-950 flex flex-col lg:flex-row text-slate-900 dark:text-white relative">
      {/* Ambient background glow matching the theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/8 blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] rounded-full bg-amber-400/8 blur-[140px]"></div>
      </div>

      {/* Mobile App Navigation Header */}
      <AdminNavHeader userName={user?.name || 'Dr. Amine Zerrouki'} />

      {/* Desktop Admin Sidebar (hidden on mobile, visible on lg+) */}
      <aside className="hidden lg:block w-72 p-4 lg:py-6 lg:pl-6 shrink-0 relative z-10">
        <div className="h-full rounded-[32px] bg-white dark:bg-navy-900 text-slate-800 dark:text-white p-6 flex flex-col justify-between border border-slate-200/80 dark:border-navy-800 shadow-[0_15px_45px_-10px_rgba(15,23,42,0.06)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
              <Logo size="sm" />
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                Admin Panel
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-navy-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/70 dark:hover:bg-navy-800 transition-all group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-navy-800 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-750 text-xs font-bold text-slate-700 dark:text-navy-200 hover:text-blue-700 transition-all border border-slate-200/70 dark:border-navy-700"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Espace Étudiant</span>
              </span>
              <span className="text-[10px] text-slate-400">Sortir</span>
            </Link>

            <div className="p-2 text-[11px] text-slate-500 dark:text-navy-400 text-center">
              Connecté : <strong className="text-slate-800 dark:text-white">{user?.name || 'Dr. Amine Zerrouki'}</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 px-3 py-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10 min-w-0 max-w-full">
        {children}
      </main>
    </div>
  );
}
