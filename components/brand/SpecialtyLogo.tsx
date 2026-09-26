'use client';

import React from 'react';

interface SpecialtyLogoProps {
  specialtyId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  withGlow?: boolean;
}

export const SPECIALTY_META: Record<string, {
  name: string;
  color: string;
  photo: string;
}> = {
  cardio: { name: 'Cardiologie', color: '#EF4444', photo: '/organs/cardio.jpg' },
  pneumo: { name: 'Pneumologie', color: '#06B6D4', photo: '/organs/pneumo.jpg' },
  neuro: { name: 'Neurologie', color: '#8B5CF6', photo: '/organs/neuro.jpg' },
  nephro: { name: 'Néphrologie', color: '#3B82F6', photo: '/organs/nephro.jpg' },
  endocrino: { name: 'Endocrinologie', color: '#F59E0B', photo: '/organs/endocrino.jpg' },
  gastro: { name: 'Gastro-entérologie', color: '#10B981', photo: '/organs/gastro.jpg' },
  pediatrie: { name: 'Pédiatrie', color: '#EC4899', photo: '/organs/pediatrie.jpg' },
  gyneco: { name: 'Gynécologie', color: '#F43F5E', photo: '/organs/gyneco.jpg' },
  dermato: { name: 'Dermatologie', color: '#EAB308', photo: '/organs/dermato.jpg' },
  infectieux: { name: 'Infectiologie', color: '#14B8A6', photo: '/organs/infectieux.jpg' },
  hemato: { name: 'Hématologie', color: '#BE123C', photo: '/organs/hemato.jpg' },
  rhumato: { name: 'Rhumatologie', color: '#84CC16', photo: '/organs/rhumato.jpg' },
  psy: { name: 'Psychiatrie', color: '#6366F1', photo: '/organs/psy.jpg' },
  ophtalmo: { name: 'Ophtalmologie', color: '#0284C7', photo: '/organs/ophtalmo.jpg' },
  orl: { name: 'O.R.L.', color: '#A855F7', photo: '/organs/orl.jpg' },
  urgences: { name: 'Urgences & Réanimation', color: '#DC2626', photo: '/organs/urgences.jpg' },
  chirurgie: { name: 'Chirurgie Générale', color: '#D97706', photo: '/organs/chirurgie.jpg' },
  uro: { name: 'Urologie', color: '#059669', photo: '/organs/uro.jpg' },
  ortho: { name: 'Orthopédie & Traumatologie', color: '#78716C', photo: '/organs/ortho.jpg' },
  interne: { name: 'Médecine Interne', color: '#38BDF8', photo: '/organs/interne.jpg' },
};

export const SpecialtyLogo: React.FC<SpecialtyLogoProps> = ({
  specialtyId,
  size = 'md',
  className = '',
  withGlow = true,
}) => {
  const meta = SPECIALTY_META[specialtyId] || SPECIALTY_META.cardio;

  const sizeClasses = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-10 h-10 min-w-[40px]',
    md: 'w-14 h-14 min-w-[56px]',
    lg: 'w-20 h-20 min-w-[80px]',
    xl: 'w-28 h-28 min-w-[112px]',
    '2xl': 'w-36 h-36 min-w-[144px]',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 group select-none ${sizeClasses} ${className}`}
      title={meta.name}
      style={{
        background: 'transparent',
        border: 'none',
        outline: 'none',
      }}
    >
      {/* Dynamic Fused Bioluminescent Aura - ZERO CADRE */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none transform scale-95"
          style={{ 
            background: `radial-gradient(circle, ${meta.color}90 0%, ${meta.color}30 50%, transparent 75%)` 
          }}
        />
      )}

      {/* 3D Organ Photo Logo Fused Seamlessly into the Theme - Frameless */}
      <img
        src={meta.photo}
        alt={meta.name}
        className="w-full h-full object-contain pointer-events-none transition-all duration-500 group-hover:scale-110 mix-blend-screen filter drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        style={{
          maskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.6) 70%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.6) 70%, transparent 95%)',
        }}
        loading="lazy"
      />
    </div>
  );
};
