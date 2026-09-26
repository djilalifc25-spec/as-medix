'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FacultyType } from '@/types';

interface FacultyContextType {
  faculty: FacultyType;
  setFaculty: (fac: FacultyType) => void;
  isTransitioning: boolean;
}

const FacultyContext = createContext<FacultyContextType>({
  faculty: 'TOUS',
  setFaculty: () => {},
  isTransitioning: false,
});

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFacultyState] = useState<FacultyType>('TOUS');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('asmedix_faculty') as FacultyType;
    const initialFac = (saved && ['TOUS', 'ORAN', 'SIDI_BEL_ABBES'].includes(saved)) ? saved : 'TOUS';
    setFacultyState(initialFac);
    document.documentElement.setAttribute('data-faculty', initialFac);
  }, []);

  const setFaculty = (fac: FacultyType) => {
    if (fac === faculty) return;
    setIsTransitioning(true);
    setFacultyState(fac);
    localStorage.setItem('asmedix_faculty', fac);
    document.documentElement.setAttribute('data-faculty', fac);

    // Reset transition state after smooth animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <FacultyContext.Provider value={{ faculty, setFaculty, isTransitioning }}>
      {isTransitioning && <div className="faculty-transition-glow pointer-events-none" aria-hidden="true" />}
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => useContext(FacultyContext);
