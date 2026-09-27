'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'minimal' | 'monochrome' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  clickable = true,
  variant = 'default',
}) => {
  const [targetHref, setTargetHref] = React.useState('/');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('asmedix_logged_in') === 'true') {
      setTargetHref('/dashboard');
    }
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) {
          setTargetHref('/dashboard');
          if (typeof window !== 'undefined') localStorage.setItem('asmedix_logged_in', 'true');
        } else {
          setTargetHref('/');
          if (typeof window !== 'undefined') localStorage.removeItem('asmedix_logged_in');
        }
      })
      .catch(() => {});
  }, []);
  const sizeMap = {
    xs: {
      box: 'w-7 h-7 rounded-lg',
      svgWidth: 16,
      svgClass: 'w-4 h-4',
      title: 'text-sm font-black',
      tag: 'text-[8px]',
      badge: 'text-[8px] px-1 py-0.5',
      gap: 'gap-1.5',
    },
    sm: {
      box: 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
      svgWidth: 20,
      svgClass: 'w-5 h-5',
      title: 'text-base sm:text-lg font-black',
      tag: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.5',
      gap: 'gap-2 sm:gap-2.5',
    },
    md: {
      box: 'w-10 h-10 rounded-2xl',
      svgWidth: 24,
      svgClass: 'w-6 h-6',
      title: 'text-lg sm:text-xl font-black',
      tag: 'text-[10px]',
      badge: 'text-[10px] px-1.5 py-0.5',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      box: 'w-12 h-12 rounded-2xl',
      svgWidth: 28,
      svgClass: 'w-7 h-7',
      title: 'text-2xl font-black',
      tag: 'text-xs',
      badge: 'text-xs px-2 py-0.5',
      gap: 'gap-3.5',
    },
    xl: {
      box: 'w-16 h-16 rounded-[22px]',
      svgWidth: 36,
      svgClass: 'w-9 h-9',
      title: 'text-3xl font-black',
      tag: 'text-sm',
      badge: 'text-sm px-2.5 py-1',
      gap: 'gap-4',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Design 3: Metallic Silver & Gold Stethoscope Monogram with Cyan Core Spark
  const renderIcon = () => {
    return (
      <div className="relative group/logo-icon flex items-center justify-center shrink-0">
        <div
          className={`${currentSize.box} flex items-center justify-center transition-all duration-300 shadow-md ${
            variant === 'monochrome'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-slate-900/10'
              : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 text-white shadow-lg shadow-slate-950/40 group-hover:scale-105 border border-amber-500/30'
          }`}
        >
          <svg
            width={currentSize.svgWidth}
            height={currentSize.svgWidth}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.svgClass} transition-transform duration-300 group-hover:scale-110 shrink-0`}
            style={{ minWidth: currentSize.svgWidth, minHeight: currentSize.svgWidth }}
          >
            {/* Silver Interlocking 'A' and 'M' */}
            <path
              d="M7 23L12 9L15 17.5M25 23L20 9L17 17.5"
              stroke="#e2e8f0"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gold Stethoscope Loop 'S' */}
            <path
              d="M11 11C13.5 9 17 9 19.5 11C21 12.5 21 15 16 16.5C11 18 11 20.5 12.5 22C15 24 18.5 24 21 22"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Cyan Core Spark */}
            <circle cx="16" cy="16.5" r="2" fill="#06b6d4" />
            <circle cx="16" cy="16.5" r="0.9" fill="#ffffff" />
          </svg>
        </div>
      </div>
    );
  };

  const content = (
    <div className={`inline-flex items-center ${currentSize.gap} select-none shrink-0 ${className}`}>
      {renderIcon()}

      {variant !== 'minimal' && (
        <div className="flex flex-col leading-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`${currentSize.title} tracking-tight ${
                variant === 'white'
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              AS
            </span>
            <span
              className={`${currentSize.title} tracking-tight ${
                variant === 'white'
                  ? 'text-white/95'
                  : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent'
              }`}
            >
              MEDIX
            </span>
            <span
              className={`font-mono font-bold tracking-tight rounded-md ${currentSize.badge} ${
                variant === 'white'
                  ? 'bg-white/20 text-white'
                  : 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-500/30'
              }`}
            >
              .dz
            </span>
          </div>

          {showTagline && (
            <span
              className={`${currentSize.tag} font-bold tracking-[0.18em] uppercase mt-1 ${
                variant === 'white'
                  ? 'text-white/70'
                  : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              Excellence Médicale
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href={targetHref} className="group inline-flex items-center focus:outline-none shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};
