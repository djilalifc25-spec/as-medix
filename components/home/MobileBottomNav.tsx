'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FlaskConical, Pill, LogIn, UserCheck } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isScrollVisible = useScrollDirection();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('asmedix_logged_in') === 'true') {
      setIsAuthenticated(true);
    }
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (typeof window !== 'undefined') localStorage.setItem('asmedix_logged_in', 'true');
        } else {
          setIsAuthenticated(false);
          if (typeof window !== 'undefined') localStorage.removeItem('asmedix_logged_in');
        }
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const updateModalState = () => {
      setIsModalOpen(
        document.body.classList.contains('modal-open') ||
        document.body.classList.contains('fullscreen-mode') ||
        Boolean(document.fullscreenElement)
      );
    };

    updateModalState();

    const observer = new MutationObserver(updateModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('fullscreenchange', updateModalState);
    window.addEventListener('modal-state-change', updateModalState);

    return () => {
      observer.disconnect();
      window.removeEventListener('fullscreenchange', updateModalState);
      window.removeEventListener('modal-state-change', updateModalState);
    };
  }, []);

  // Only render on landing page or demo (dashboard routes use DashboardShell's MobileBottomNav)
  if (pathname !== '/' && pathname !== '/demo') {
    return null;
  }

  const isHidden = isModalOpen || !isScrollVisible;

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const navItems = [
    { 
      href: isAuthenticated ? '/dashboard' : '/', 
      label: isAuthenticated ? 'Tableau de bord' : 'Accueil', 
      icon: Home 
    },
    { href: '/cours', label: 'Spécialités', icon: BookOpen },
    { href: '/qcm', label: 'QCM', icon: FlaskConical },
    { href: '/medicaments', label: 'Pharmnet', icon: Pill },
    { 
      href: isAuthenticated ? '/dashboard' : '/login', 
      label: isAuthenticated ? 'Mon Espace' : 'Connexion', 
      icon: isAuthenticated ? UserCheck : LogIn 
    },
  ];

  return createPortal(
    <nav
      className={`mobile-bottom-nav fixed left-0 right-0 sm:hidden transition-all duration-300 ease-out ${
        isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: isHidden ? '-120px' : '0px',
        zIndex: 99999,
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
        margin: 0,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/60 dark:border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_0_rgba(0,0,0,0.4)]" />
      
      <div className="relative flex items-stretch justify-around px-1 pt-2 pb-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 active:scale-90 select-none ${
                isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900/50 shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
              </div>
              <span className={`text-[10px] tracking-tight leading-tight ${
                isActive ? 'font-black text-blue-600 dark:text-sky-400' : 'font-medium'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>,
    document.body
  );
}

