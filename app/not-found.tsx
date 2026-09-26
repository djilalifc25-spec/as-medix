'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowLeft, Home, Stethoscope } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-50/50 dark:bg-navy-950 flex flex-col items-center justify-center p-4 text-center">
      <Logo size="lg" showTagline={true} />
      <div className="mt-8 max-w-md space-y-4">
        <span className="text-6xl font-black text-brand-600 dark:text-brand-400">404</span>
        <h1 className="text-2xl font-black text-navy-950 dark:text-white">
          Page clinique introuvable
        </h1>
        <p className="text-sm text-navy-600 dark:text-navy-300">
          Le document médical ou la page demandée n'existe pas ou a été déplacée vers une autre spécialité.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-soft"
          >
            <Home className="w-4 h-4" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/cours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-white hover:bg-white"
          >
            <span>Bibliothèque des cours</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
