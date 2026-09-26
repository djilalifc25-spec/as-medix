'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SpecialtyTheme {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  secondaryColor: string;
  organTitle: string;
  organSubtitle: string;
  organImage: string;
  bgSvgPath?: string;
}

export const SPECIALTY_THEMES: Record<string, SpecialtyTheme> = {
  cardio: {
    id: 'cardio',
    name: 'Cardiologie',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    secondaryColor: '#38BDF8',
    organTitle: 'Système Cardiovasculaire',
    organSubtitle: 'Myocarde, Péricarde & Arbre Coronarien',
    organImage: '/organs/cardio.jpg',
  },
  pneumo: {
    id: 'pneumo',
    name: 'Pneumologie',
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    secondaryColor: '#3B82F6',
    organTitle: 'Système Respiratoire',
    organSubtitle: 'Poumons, Alvéoles & Échanges Gazeux',
    organImage: '/organs/pneumo.jpg',
  },
  neuro: {
    id: 'neuro',
    name: 'Neurologie',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    secondaryColor: '#EC4899',
    organTitle: 'Système Nerveux Central',
    organSubtitle: 'Cerveau, Tronc Cérébral & Moelle Épinière',
    organImage: '/organs/neuro.jpg',
  },
  nephro: {
    id: 'nephro',
    name: 'Néphrologie',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    secondaryColor: '#06B6D4',
    organTitle: 'Système Rénal & Filtration',
    organSubtitle: 'Reins, Néphrons & Équilibre Hydro-Électrolytique',
    organImage: '/organs/nephro.jpg',
  },
  endocrino: {
    id: 'endocrino',
    name: 'Endocrinologie',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    secondaryColor: '#EF4444',
    organTitle: 'Système Endocrinien',
    organSubtitle: 'Thyroïde, Surrénales, Pancréas & Hypophyse',
    organImage: '/organs/endocrino.jpg',
  },
  gastro: {
    id: 'gastro',
    name: 'Gastro-entérologie',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    secondaryColor: '#F59E0B',
    organTitle: 'Système Digestif & Hépatique',
    organSubtitle: 'Foie, Vésicule Biliaire & Tube Digestif',
    organImage: '/organs/gastro.jpg',
  },
  pediatrie: {
    id: 'pediatrie',
    name: 'Pédiatrie',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    secondaryColor: '#8B5CF6',
    organTitle: 'Médecine Infantile & Pédiatrique',
    organSubtitle: 'Développement, Croissance & Urgences Pédiatriques',
    organImage: '/organs/pediatrie.jpg',
  },
  gyneco: {
    id: 'gyneco',
    name: 'Gynécologie - Obstétrique',
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    secondaryColor: '#EC4899',
    organTitle: 'Santé Féminine & Maternité',
    organSubtitle: 'Utérus, Ovaires & Suivi de Grossesse',
    organImage: '/organs/gyneco.jpg',
  },
  dermato: {
    id: 'dermato',
    name: 'Dermatologie',
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    secondaryColor: '#F59E0B',
    organTitle: 'Système Cutané & Phanères',
    organSubtitle: 'Épiderme, Derme & Toxidermies',
    organImage: '/organs/dermato.jpg',
  },
  infectieux: {
    id: 'infectieux',
    name: 'Infectiologie',
    color: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    secondaryColor: '#10B981',
    organTitle: 'Maladies Infectieuses & Sepsis',
    organSubtitle: 'Bactériologie, Virologie & Antibiothérapie',
    organImage: '/organs/infectieux.jpg',
  },
  hemato: {
    id: 'hemato',
    name: 'Hématologie',
    color: '#BE123C',
    glowColor: 'rgba(190, 18, 60, 0.35)',
    secondaryColor: '#EF4444',
    organTitle: 'Système Hématopoïétique',
    organSubtitle: 'Cellules Sanguines, Moelle Osseuse & Hémostase',
    organImage: '/organs/hemato.jpg',
  },
  rhumato: {
    id: 'rhumato',
    name: 'Rhumatologie',
    color: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.35)',
    secondaryColor: '#10B981',
    organTitle: 'Système Ostéo-Articulaire',
    organSubtitle: 'Articulations, Cartilage, Colonne & Tendons',
    organImage: '/organs/rhumato.jpg',
  },
  psy: {
    id: 'psy',
    name: 'Psychiatrie',
    color: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    secondaryColor: '#8B5CF6',
    organTitle: 'Santé Mentale & Psychiatrie',
    organSubtitle: 'Neurobiologie, Humeur & Cognition',
    organImage: '/organs/psy.jpg',
  },
  ophtalmo: {
    id: 'ophtalmo',
    name: 'Ophtalmologie',
    color: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.35)',
    secondaryColor: '#38BDF8',
    organTitle: 'Système Visuel & Oculaire',
    organSubtitle: 'Rétine, Nerf Optique, Cornée & Cristallin',
    organImage: '/organs/ophtalmo.jpg',
  },
  orl: {
    id: 'orl',
    name: 'O.R.L.',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    secondaryColor: '#EC4899',
    organTitle: 'Sphère Oto-Rhino-Laryngée',
    organSubtitle: 'Oreille, Pharynx, Larynx & Sinus',
    organImage: '/organs/orl.jpg',
  },
  urgences: {
    id: 'urgences',
    name: 'Urgences & Réanimation',
    color: '#DC2626',
    glowColor: 'rgba(220, 38, 38, 0.35)',
    secondaryColor: '#F59E0B',
    organTitle: 'Soins Critiques & Réanimation',
    organSubtitle: 'Défaillances Viscérales, Choc & Arrêt Cardio-Respiratoire',
    organImage: '/organs/urgences.jpg',
  },
  chirurgie: {
    id: 'chirurgie',
    name: 'Chirurgie Générale',
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.35)',
    secondaryColor: '#EF4444',
    organTitle: 'Chirurgie Digestive & Abdominale',
    organSubtitle: 'Paroi Abdominale, Urgences Chirurgicales & Laparoscopie',
    organImage: '/organs/chirurgie.jpg',
  },
  uro: {
    id: 'uro',
    name: 'Urologie',
    color: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.35)',
    secondaryColor: '#06B6D4',
    organTitle: 'Système Uro-Génital',
    organSubtitle: 'Vessie, Prostate, Voies Excrétrices & Reins',
    organImage: '/organs/uro.jpg',
  },
  ortho: {
    id: 'ortho',
    name: 'Orthopédie & Traumatologie',
    color: '#78716C',
    glowColor: 'rgba(120, 113, 108, 0.35)',
    secondaryColor: '#F59E0B',
    organTitle: 'Traumatologie & Chirurgie Osseuse',
    organSubtitle: 'Squelette, Fractures, Prothèses & Appareil Locomoteur',
    organImage: '/organs/ortho.jpg',
  },
  interne: {
    id: 'interne',
    name: 'Médecine Interne',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    secondaryColor: '#8B5CF6',
    organTitle: 'Médecine Interne & Polyvalente',
    organSubtitle: 'Maladies Systémiques, Auto-Immunes & Orphelines',
    organImage: '/organs/interne.jpg',
  },
};

interface SpecialtyThemeContextType {
  activeSpecialty: SpecialtyTheme;
  setActiveSpecialtyId: (id: string) => void;
  nextSpecialty: () => void;
  prevSpecialty: () => void;
  isAutoRotating: boolean;
  setIsAutoRotating: (val: boolean) => void;
}

const SpecialtyThemeContext = createContext<SpecialtyThemeContextType>({
  activeSpecialty: SPECIALTY_THEMES.cardio,
  setActiveSpecialtyId: () => {},
  nextSpecialty: () => {},
  prevSpecialty: () => {},
  isAutoRotating: true,
  setIsAutoRotating: () => {},
});

export const SpecialtyThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSpecialtyId, setActiveSpecialtyId] = useState<string>('cardio');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  const specialtyKeys = Object.keys(SPECIALTY_THEMES);

  const nextSpecialty = useCallback(() => {
    setActiveSpecialtyId((prev) => {
      const nextIndex = (specialtyKeys.indexOf(prev) + 1) % specialtyKeys.length;
      return specialtyKeys[nextIndex];
    });
  }, [specialtyKeys]);

  const prevSpecialty = useCallback(() => {
    setActiveSpecialtyId((prev) => {
      const prevIndex = (specialtyKeys.indexOf(prev) - 1 + specialtyKeys.length) % specialtyKeys.length;
      return specialtyKeys[prevIndex];
    });
  }, [specialtyKeys]);

  // Rotation automatique toutes les 5 secondes
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      nextSpecialty();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoRotating, nextSpecialty]);

  const activeSpecialty = SPECIALTY_THEMES[activeSpecialtyId] || SPECIALTY_THEMES.cardio;

  return (
    <SpecialtyThemeContext.Provider
      value={{
        activeSpecialty,
        setActiveSpecialtyId,
        nextSpecialty,
        prevSpecialty,
        isAutoRotating,
        setIsAutoRotating,
      }}
    >
      {children}
    </SpecialtyThemeContext.Provider>
  );
};

export const useSpecialtyTheme = () => useContext(SpecialtyThemeContext);
