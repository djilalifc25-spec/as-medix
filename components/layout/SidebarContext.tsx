'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  toggleMobileOpen: () => void;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapsed: () => {},
  setCollapsed: () => {},
  isMobileOpen: false,
  toggleMobileOpen: () => {},
  setMobileOpen: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Sync modal-open on body so MobileBottomNav hides and background scroll locks when drawer opens
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileOpen) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
      window.dispatchEvent(new Event('modal-state-change'));
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('modal-open');
      }
    };
  }, [isMobileOpen]);

  // Auto-minimize the sidebar when the user is reading a course or a CAT protocol!
  useEffect(() => {
    const isReaderRoute = (
      (pathname.startsWith('/cours/') && pathname !== '/cours') ||
      (pathname.startsWith('/cat/') && pathname !== '/cat') ||
      (pathname.startsWith('/cas-cliniques/') && pathname !== '/cas-cliniques')
    );

    if (isReaderRoute) {
      setIsCollapsed(true);
    }
  }, [pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const toggleMobileOpen = () => {
    setIsMobileOpen(prev => !prev);
  };

  const setMobileOpen = (open: boolean) => {
    setIsMobileOpen(open);
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        setCollapsed,
        isMobileOpen,
        toggleMobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
