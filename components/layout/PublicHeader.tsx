'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon, Menu, X, ArrowRight, Sparkles, BookOpen, HeartPulse, Stethoscope } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-navy-900/80 border-b border-navy-100/80 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo size="md" showTagline={true} />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/cours"
            className="text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Cours & Fiches
          </Link>
          <Link
            href="/qcm"
            className="text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Banque QCM
          </Link>
          <Link
            href="/cat"
            className="text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            CAT Urgences
          </Link>
          <Link
            href="/ecg"
            className="text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            ECG
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Tarifs
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Try without account pill */}
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Essai direct sans compte</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Basculer le mode sombre"
            className="p-2 rounded-xl text-navy-500 hover:text-navy-900 dark:text-navy-400 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Login button */}
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-navy-700 dark:text-navy-200 hover:text-brand-600 transition-colors"
          >
            Connexion
          </Link>

          {/* Register primary CTA */}
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-soft shadow-brand-500/20 transition-all"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-100 dark:border-navy-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/cours"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-navy-700 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800"
            >
              Cours & Fiches
            </Link>
            <Link
              href="/qcm"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-navy-700 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800"
            >
              Banque QCM
            </Link>
            <Link
              href="/cat"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-navy-700 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800"
            >
              CAT Urgences
            </Link>
            <Link
              href="/ecg"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-navy-700 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800"
            >
              ECG du jour
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-navy-700 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800"
            >
              Tarifs
            </Link>
          </nav>
          <div className="pt-4 border-t border-navy-100 dark:border-navy-800 flex flex-col gap-2">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200"
            >
              Essai direct sans compte
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl font-semibold border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-white"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl font-semibold bg-brand-600 text-white shadow-soft"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
