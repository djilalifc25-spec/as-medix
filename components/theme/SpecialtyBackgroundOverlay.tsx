'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';

export const SpecialtyBackgroundOverlay: React.FC = () => {
  const pathname = usePathname();
  const { activeSpecialty } = useSpecialtyTheme();

  // Hide 3D organ background on auth screens to keep login/register clean and professional
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. Base Atmospheric Background (Clean Bioluminescent Forest / Deep Space - ZERO TEXT) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 dark:opacity-55 scale-100 filter saturate-125 contrast-105 transition-opacity duration-1000"
        style={{ backgroundImage: "url('/forest-clean-bg.jpg')" }}
      />

      {/* 2. Deep Cinematic Medical Gradient Tint (Adapts to Dark / Light Mode) */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#f8fafc]/90 via-[#f1f5f9]/80 to-[#f8fafc]/95 dark:from-[#070b14]/85 dark:via-[#090e1f]/75 dark:to-[#070b14]/90 transition-colors duration-1000" 
      />

      {/* 3. Dynamic Specialty Bioluminescent Halos & Plasma Lights */}
      <div
        className="absolute -top-24 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-35 dark:opacity-45 transition-all duration-1000 transform pointer-events-none"
        style={{ backgroundColor: activeSpecialty.color }}
      />
      <div
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[160px] opacity-25 dark:opacity-40 transition-all duration-1000 transform pointer-events-none"
        style={{ backgroundColor: activeSpecialty.secondaryColor }}
      />
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[180px] opacity-20 dark:opacity-30 transition-all duration-1000 transform pointer-events-none"
        style={{ backgroundColor: activeSpecialty.color }}
      />

      {/* 4. Centerpiece: 3D Crystal Holographic Organ with Smooth Cross-Fade & Float (ZERO CADRE) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="relative w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] lg:w-[740px] lg:h-[740px] max-w-[85vw] max-h-[85vh] flex items-center justify-center -translate-y-8 sm:translate-y-0">
          
          {/* Radial glow aura matching organ bioluminescent veins */}
          <div 
            className="absolute inset-0 rounded-full blur-[80px] sm:blur-[100px] opacity-30 dark:opacity-50 transition-all duration-1000 transform scale-75"
            style={{ 
              background: `radial-gradient(circle, ${activeSpecialty.color}60 0%, ${activeSpecialty.secondaryColor}25 45%, transparent 70%)` 
            }}
          />

          {/* 3D Anatomical Glass Organ Visual */}
          <div 
            key={activeSpecialty.id} 
            className="w-full h-full flex items-center justify-center animate-organ-enter"
          >
            <img
              src={activeSpecialty.organImage || `/organs/${activeSpecialty.id}.jpg`}
              alt={activeSpecialty.name}
              className="w-full h-full object-contain mix-blend-screen opacity-45 sm:opacity-70 dark:opacity-55 dark:sm:opacity-85 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] animate-organ-float transition-all duration-1000"
              style={{
                maskImage: 'radial-gradient(circle at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 80%)',
              }}
            />
          </div>

        </div>
      </div>

    </div>
  );
};
