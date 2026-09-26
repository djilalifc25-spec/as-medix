'use client';

import React from 'react';
import {
  HeartPulse, Wind, Brain, ActivitySquare, Flame, Utensils, Baby,
  HeartHandshake, Sparkles, Bug, Droplet, Bone, Smile, Eye, Headphones,
  Siren, Scissors, ShieldAlert, Footprints, Compass, Stethoscope
} from 'lucide-react';

interface SpecialtyIconProps {
  specialtyId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface SpecialtyTheme {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
}

const SPECIALTY_THEMES: Record<string, SpecialtyTheme> = {
  cardio: { icon: HeartPulse, gradient: 'from-rose-500 to-red-600', glowColor: 'rgba(239, 68, 68, 0.25)' },
  pneumo: { icon: Wind, gradient: 'from-cyan-500 to-sky-600', glowColor: 'rgba(6, 182, 212, 0.25)' },
  neuro: { icon: Brain, gradient: 'from-purple-500 to-indigo-600', glowColor: 'rgba(139, 92, 246, 0.25)' },
  nephro: { icon: ActivitySquare, gradient: 'from-blue-500 to-indigo-700', glowColor: 'rgba(59, 130, 246, 0.25)' },
  endocrino: { icon: Flame, gradient: 'from-amber-500 to-orange-600', glowColor: 'rgba(245, 158, 11, 0.25)' },
  gastro: { icon: Utensils, gradient: 'from-emerald-500 to-teal-600', glowColor: 'rgba(16, 185, 129, 0.25)' },
  pediatrie: { icon: Baby, gradient: 'from-pink-500 to-rose-600', glowColor: 'rgba(236, 72, 153, 0.25)' },
  gyneco: { icon: HeartHandshake, gradient: 'from-fuchsia-500 to-pink-600', glowColor: 'rgba(244, 63, 94, 0.25)' },
  dermato: { icon: Sparkles, gradient: 'from-yellow-500 to-amber-600', glowColor: 'rgba(234, 179, 8, 0.25)' },
  infectieux: { icon: Bug, gradient: 'from-teal-500 to-emerald-700', glowColor: 'rgba(20, 184, 166, 0.25)' },
  hemato: { icon: Droplet, gradient: 'from-red-600 to-rose-800', glowColor: 'rgba(190, 18, 60, 0.25)' },
  rhumato: { icon: Bone, gradient: 'from-lime-500 to-emerald-600', glowColor: 'rgba(132, 204, 22, 0.25)' },
  psy: { icon: Smile, gradient: 'from-indigo-500 to-violet-700', glowColor: 'rgba(99, 102, 241, 0.25)' },
  ophtalmo: { icon: Eye, gradient: 'from-sky-500 to-blue-700', glowColor: 'rgba(2, 132, 199, 0.25)' },
  orl: { icon: Headphones, gradient: 'from-violet-500 to-purple-700', glowColor: 'rgba(168, 85, 247, 0.25)' },
  urgences: { icon: Siren, gradient: 'from-red-600 to-rose-700', glowColor: 'rgba(220, 38, 38, 0.3)' },
  chirurgie: { icon: Scissors, gradient: 'from-amber-600 to-orange-700', glowColor: 'rgba(217, 119, 6, 0.25)' },
  uro: { icon: ShieldAlert, gradient: 'from-emerald-600 to-teal-700', glowColor: 'rgba(5, 150, 105, 0.25)' },
  ortho: { icon: Footprints, gradient: 'from-stone-500 to-zinc-700', glowColor: 'rgba(120, 113, 108, 0.25)' },
  interne: { icon: Compass, gradient: 'from-slate-600 to-navy-800', glowColor: 'rgba(71, 85, 105, 0.25)' }
};

const DEFAULT_THEME: SpecialtyTheme = {
  icon: Stethoscope,
  gradient: 'from-brand-500 to-indigo-600',
  glowColor: 'rgba(99, 102, 241, 0.25)'
};

const SIZES = {
  sm: { container: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10 rounded-2xl', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6' },
  xl: { container: 'w-16 h-16 rounded-3xl', icon: 'w-8 h-8' }
};

export const SpecialtyIcon: React.FC<SpecialtyIconProps> = ({
  specialtyId,
  size = 'md',
  className = ''
}) => {
  const theme = SPECIALTY_THEMES[specialtyId] || DEFAULT_THEME;
  const IconComponent = theme.icon;
  const sizeConfig = SIZES[size] || SIZES.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br ${theme.gradient} text-white shadow-soft transition-transform hover:scale-105 ${sizeConfig.container} ${className}`}
      style={{
        boxShadow: `0 4px 14px 0 ${theme.glowColor}`
      }}
    >
      <div className="absolute inset-0 rounded-inherit bg-white/10 backdrop-blur-[1px] opacity-40"></div>
      <IconComponent className={`relative z-10 ${sizeConfig.icon} stroke-[2.2] drop-shadow-sm`} />
    </div>
  );
};
