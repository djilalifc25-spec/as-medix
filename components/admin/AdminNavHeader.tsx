'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  Menu, X, ExternalLink,
  LayoutDashboard, BookOpen, Brain, FileText, ShieldAlert, Activity, Pill,
  Users, Settings, MessageSquare, CreditCard, Siren, Bell, Sparkles
} from 'lucide-react';

interface AdminNavHeaderProps {
  userName: string;
}

const navItems = [
  { label: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
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
  { label: 'Paramètres & Quotas', href: '/admin/parametres', icon: Settings },
];

export const AdminNavHeader: React.FC<AdminNavHeaderProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="lg:hidden sticky top-0 z-40 px-4 pb-3 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-navy-800 flex items-center justify-between shadow-xs" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-1 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-navy-200 active:scale-95 transition-all"
            aria-label="Ouvrir le menu admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            Admin
          </span>
          <Link
            href="/dashboard"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-navy-300 text-xs font-bold"
            title="Sortir vers l'espace étudiant"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </div>

      {/* Slide-over Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Mobile Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-[70] w-72 max-w-[85vw] bg-white dark:bg-navy-900 shadow-2xl px-5 flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
            <Logo size="sm" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-500 hover:text-slate-800 dark:text-navy-400 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2">
            Navigation CMS & Gestion
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-navy-300 hover:bg-slate-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-navy-800 space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-navy-800 text-xs font-bold text-slate-700 dark:text-navy-200 border border-slate-200/70 dark:border-navy-700"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Espace Étudiant</span>
            </span>
            <span className="text-[10px] text-slate-400">Sortir</span>
          </Link>

          <div className="p-2 text-[10px] text-slate-500 dark:text-navy-400 text-center truncate">
            Connecté : <strong className="text-slate-800 dark:text-white">{userName}</strong>
          </div>
        </div>
      </div>
    </>
  );
};
