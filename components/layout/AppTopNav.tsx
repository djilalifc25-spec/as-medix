'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useFaculty } from '@/components/context/FacultyContext';
import { Logo } from '@/components/brand/Logo';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { QuickAddModal } from '@/components/modals/QuickAddModal';
import { BiologicalNormsModal } from '@/components/modals/BiologicalNormsModal';
import { useSidebar } from './SidebarContext';
import {
  Search, Bell, Sun, Moon, LogOut, Shield, Sparkles,
  Brain, Check, X, Plus, Menu, Crown, Star, Rocket, Zap,
  User as UserIcon
} from 'lucide-react';
import { User, NotificationItem } from '@/types';

export const AppTopNav: React.FC<{ user?: User | null }> = ({ user: initialUser }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { faculty, setFaculty } = useFaculty();
  const { toggleMobileOpen } = useSidebar();
  
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser || null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [normsOpen, setNormsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifsDropdownOpen, setNotifsDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Update currentUser when initialUser changes
  useEffect(() => {
    if (initialUser) setCurrentUser(initialUser);
  }, [initialUser]);

  // Sync notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  // Sync current user session in real-time (to instantly catch admin upgrades)
  const syncUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(prev => ({
          ...(prev || {}),
          ...data.user,
        }));
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    syncUserSession();

    const handleNotifAdded = () => {
      fetchNotifications();
    };
    window.addEventListener('asmedix-notification-added', handleNotifAdded);

    const interval = setInterval(() => {
      fetchNotifications();
      syncUserSession();
    }, 10000);
    return () => {
      window.removeEventListener('asmedix-notification-added', handleNotifAdded);
      clearInterval(interval);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      await fetchNotifications();
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('asmedix_logged_in');
      window.location.href = '/login';
    } else {
      router.push('/login');
    }
  };

  const isDark = theme === 'dark';

  // Account tier styling & icons
  const getTierConfig = (plan?: string) => {
    const p = (plan || 'FREE').toUpperCase();
    if (p === 'PREMIUM') {
      return {
        type: 'PREMIUM' as const,
        label: 'PREMIUM',
        mobileBadge: '👑 VIP',
        icon: Crown,
        badgeClass: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        iconClass: 'text-amber-500 fill-amber-500/30',
        subtitle: 'Accès Total VIP Illimité',
        isFree: false
      };
    }
    if (p === 'PRO') {
      return {
        type: 'PRO' as const,
        label: 'PRO',
        mobileBadge: '⭐ PRO',
        icon: Star,
        badgeClass: 'bg-gradient-to-r from-indigo-500/20 via-purple-500/25 to-indigo-500/20 text-[#5D5FEF] dark:text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(93,95,239,0.25)]',
        iconClass: 'text-[#5D5FEF] fill-[#5D5FEF]/30',
        subtitle: 'Accès Résidanat Illimité',
        isFree: false
      };
    }
    return {
      type: 'FREE' as const,
      label: 'DÉMO',
      mobileBadge: '🚀 DÉMO',
      icon: Rocket,
      badgeClass: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/15',
      iconClass: 'text-slate-500 dark:text-slate-400',
      subtitle: 'Version Démo Gratuite',
      isFree: true
    };
  };

  const tier = getTierConfig(currentUser?.plan);
  const TierIcon = tier.icon;

  return (
    <>
      <header
        className="topnav sticky top-0 z-[500] shrink-0 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors"
        style={{ paddingTop: 'max(0px, env(safe-area-inset-top, 0px))' }}
      >
        <div className="mx-auto flex h-14 items-center justify-between gap-1 sm:gap-3 px-2 sm:px-5">
          
          {/* Left: Hamburger + Logo + Mobile Tier Badge */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={toggleMobileOpen}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl btn-ghost shrink-0"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block shrink-0">
              <Logo size="sm" />
            </div>
            <div className="sm:hidden shrink-0">
              <Logo size="sm" variant="minimal" />
            </div>

            {/* Prominent Tier Icon / Badge (Always visible on mobile & desktop) */}
            <Link
              href={tier.isFree ? '/pricing' : '/dashboard'}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black border transition-all active:scale-95 shrink-0 ${tier.badgeClass}`}
              title={`${tier.label} - ${tier.subtitle}`}
            >
              <TierIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${tier.iconClass}`} />
              <span className="tracking-wide">{tier.label}</span>
              {tier.isFree && (
                <span className="hidden xs:inline-block text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                  CHOISIR
                </span>
              )}
            </Link>
          </div>

          {/* Center: Faculty Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
            {(['TOUS', 'ORAN', 'SIDI_BEL_ABBES'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFaculty(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  faculty === f
                    ? 'bg-white dark:bg-slate-700 text-[#5D5FEF] shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {f === 'TOUS' ? '🇩🇿 National' : f === 'ORAN' ? '☀️ Oran' : '🌿 SBA'}
              </button>
            ))}
          </div>

          {/* Right: Action Icons (Theme, Notifications, Account ALWAYS VISIBLE) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* If Demo/Free: Desktop "Choisir un Forfait" CTA Button */}
            {tier.isFree && (
              <Link
                href="/pricing"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Forfaits PRO & VIP</span>
              </Link>
            )}

            {/* Search (Desktop) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl btn-ghost hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#5D5FEF] shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Rechercher…</span>
              <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">⌘K</kbd>
            </button>

            {/* Quick Add (Hidden on small mobile so essential icons always fit) */}
            <button
              onClick={() => setQuickAddOpen(true)}
              className="p-2 rounded-xl btn-ghost text-slate-500 dark:text-slate-400 hover:text-[#5D5FEF] hidden sm:flex shrink-0"
              title="Ajout rapide"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* 1. THEME TOGGLE (Light / Dark) - ALWAYS VISIBLE ON ALL SCREENS */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl btn-ghost text-slate-600 dark:text-slate-300 hover:text-[#5D5FEF] shrink-0 active:scale-90 transition-transform cursor-pointer"
              title={isDark ? 'Mode Jour' : 'Mode Nuit'}
              aria-label="Changer le thème jour/nuit"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* 2. NOTIFICATIONS (Bell with unread badge) - ALWAYS VISIBLE ON ALL SCREENS */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifsDropdownOpen(!notifsDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl btn-ghost text-slate-600 dark:text-slate-300 hover:text-[#5D5FEF] shrink-0 active:scale-90 transition-transform cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-slate-900"></span>
                  </span>
                )}
              </button>

              {notifsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[99990] bg-slate-950/30 backdrop-blur-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifsDropdownOpen(false);
                    }}
                  />
                  <div
                    className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-12 z-[99995] w-[calc(100vw-1rem)] sm:w-96 max-w-sm card overflow-hidden shadow-2xl animate-fade-up border border-slate-200 dark:border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="badge badge-iris text-[10px]">{unreadCount}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-[#5D5FEF] font-semibold hover:underline flex items-center gap-1">
                            <Check className="w-3 h-3" /> Tout lire
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNotifsDropdownOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-400">
                          <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          Aucune notification pour le moment
                        </div>
                      ) : notifications.slice(0, 8).map(n => (
                        <div
                          key={n.id}
                          onClick={async () => {
                            try {
                              await fetch('/api/notifications', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: n.id }),
                              });
                              fetchNotifications();
                            } catch {}
                            if (n.linkUrl) {
                              router.push(n.linkUrl);
                              setNotifsDropdownOpen(false);
                            }
                          }}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/60 dark:bg-indigo-950/25' : ''}`}
                        >
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${!n.read ? 'bg-[#5D5FEF] ring-4 ring-indigo-500/20' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(n.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. PROFILE MENU TRIGGER - ALWAYS VISIBLE ON ALL SCREENS */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifsDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/8 transition-all active:scale-95 cursor-pointer shrink-0"
                aria-label="Mon compte"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#4340C4] flex items-center justify-center text-white text-xs font-black shrink-0 shadow-xs ring-2 ring-brand-500/20">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight max-w-[100px] truncate">
                    {currentUser?.name?.split(' ')[0] || 'Docteur'}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-bold border ${tier.badgeClass}`}>
                      <TierIcon className={`w-2.5 h-2.5 ${tier.iconClass}`} />
                      {tier.label}
                    </span>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[99990] bg-slate-950/30 backdrop-blur-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                    }}
                  />
                  <div
                    className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-12 z-[99995] w-72 card overflow-hidden shadow-2xl animate-fade-up border border-slate-200 dark:border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser?.name || 'Docteur'}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || ''}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prominent Tier Card */}
                      <div className={`mt-2.5 p-2 rounded-xl border flex items-center justify-between ${tier.badgeClass}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white/40 dark:bg-black/30 flex items-center justify-center">
                            <TierIcon className={`w-4 h-4 ${tier.iconClass}`} />
                          </div>
                          <div>
                            <div className="text-xs font-black tracking-wide">Compte {tier.label}</div>
                            <div className="text-[10px] opacity-80">{tier.subtitle}</div>
                          </div>
                        </div>
                      </div>

                      {tier.isFree && (
                        <Link
                          href="/pricing"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all text-center"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Débloquer mon Forfait (PRO ou VIP)
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <Link href="/profil" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <UserIcon className="w-3.5 h-3.5 text-[#5D5FEF]" /> Mon Compte & Profil
                      </Link>
                      <Link href="/reminders" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <Bell className="w-3.5 h-3.5 text-[#5D5FEF]" /> Mes Rappels & Pièges
                      </Link>
                      <Link href="/progression" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <Brain className="w-3.5 h-3.5 text-emerald-500" /> Mon Parcours
                      </Link>
                      <Link href="/contact" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <Shield className="w-3.5 h-3.5 text-amber-500" /> Support & Contact
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {searchOpen && <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
      {normsOpen && <BiologicalNormsModal isOpen={normsOpen} onClose={() => setNormsOpen(false)} />}
      {quickAddOpen && <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />}
    </>
  );
};
