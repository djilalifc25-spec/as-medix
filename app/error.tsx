'use client';

import React from 'react';
import { Logo } from '@/components/brand/Logo';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-navy-50/50 dark:bg-navy-950 flex flex-col items-center justify-center p-4 text-center">
      <Logo size="lg" />
      <div className="mt-8 max-w-md space-y-4">
        <span className="text-5xl font-black text-rose-500">500</span>
        <h1 className="text-2xl font-black text-navy-950 dark:text-white">
          Une anomalie est survenue
        </h1>
        <p className="text-sm text-navy-600 dark:text-navy-300">
          Notre équipe technique a été notifiée. Veuillez réessayer de recharger la vue.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-soft"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-white hover:bg-white"
          >
            <Home className="w-4 h-4" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
