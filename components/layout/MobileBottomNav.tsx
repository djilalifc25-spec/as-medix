'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import {
  Home, BookOpen, Brain, Siren, Menu, User
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { isMobileOpen, toggleMobileOpen } = useSidebar();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isScrollVisible = useScrollDirection();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const checkState = () => {
      const isFullscreenActive = 
        document.body.classList.contains('fullscreen-mode') ||
        document.body.classList.contains('modal-open') ||
        Boolean(document.fullscreenElement);
      setIsModalOpen(isFullscreenActive);
    };

    checkState();

    const observer = new MutationObserver(checkState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('fullscreenchange', checkState);
    window.addEventListener('modal-state-change', checkState);

    return () => {
      observer.disconnect();
      window.removeEventListener('fullscreenchange', checkState);
      window.removeEventListener('modal-state-change', checkState);
    };
  }, []);

  const navItems = [
    { label: 'Accueil', href: '/dashboard', icon: Home },
    { label: 'Cours', href: '/cours', icon: BookOpen },
    { label: 'QCM', href: '/qcm', icon: Brain },
    { label: 'Garde', href: '/garde', icon: Siren, isUrgence: true },
    { label: 'Compte', href: '/profil', icon: User },
  ];

  // Disappears when scrolling down, reappears when scrolling up!
  const isHidden = isModalOpen || !isScrollVisible;

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <nav
      aria-label="Navigation mobile"
      className={`mobile-bottom-nav lg:hidden fixed left-0 right-0 bg-slate-900/95 dark:bg-[#070b14]/95 backdrop-blur-2xl border-t border-white/10 px-1 pt-1.5 flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out z-[99999] ${
        isHidden
          ? 'opacity-0 pointer-events-none translate-y-full'
          : 'opacity-100 pointer-events-auto translate-y-0'
      }`}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0px))',
        margin: 0,
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center py-1 px-1.5 xs:px-2.5 rounded-2xl transition-all duration-200 active:scale-90 select-none ${
              isActive
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-[0_0_14px_rgba(14,165,233,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-sky-400' : ''}`} />
              {item.isUrgence && (
                <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </div>
            <span className={`text-[9.5px] xs:text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-sky-400' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Menu / Spécialités button to trigger full sidebar drawer */}
      <button
        type="button"
        onClick={toggleMobileOpen}
        aria-label="Ouvrir le menu complet"
        className={`relative flex flex-col items-center justify-center py-1 px-1.5 xs:px-2.5 rounded-2xl transition-all duration-200 active:scale-90 select-none ${
          isMobileOpen
            ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-[0_0_14px_rgba(110,86,207,0.3)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Menu className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-emerald-500 text-[9px] font-black text-slate-950">
            20
          </span>
        </div>
        <span className="text-[9.5px] xs:text-[10px] tracking-tight mt-0.5 font-medium">
          Menu
        </span>
      </button>
    </nav>,
    document.body
  );
};
