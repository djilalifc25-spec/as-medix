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

  // SVG Icon: High-contrast Medical Cross intersected with glowing ECG Pulse
  const renderIcon = () => {
    return (
      <div className="relative group/logo-icon flex items-center justify-center shrink-0">
        <div
          className={`${currentSize.box} flex items-center justify-center transition-all duration-300 shadow-md ${
            variant === 'monochrome'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-slate-900/10'
              : 'bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 group-hover:shadow-sky-500/40'
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
            {/* Soft Ambient Inner Glow */}
            <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.12" />

            {/* Precision Medical Cross */}
            <path
              d="M13 5C13 4.44772 13.4477 4 14 4H18C18.5523 4 19 4.44772 19 5V13H27C27.5523 13 28 13.4477 28 14V18C28 18.5523 27.5523 19 27 19H19V27C19 27.5523 18.5523 28 18 28H14C13.4477 28 13 27.5523 13 27V19H5C4.44772 19 4 18.5523 4 18V14C4 13.4477 4.44772 13 5 13H13V5Z"
              fill="white"
              fillOpacity="0.35"
            />

            {/* Dynamic Vital ECG Pulse wave running through */}
            <path
              d="M4 16H9.5L12 11L15 21.5L17.5 13.5L19.5 17.5L21.5 16H28"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Vital Node */}
            <circle cx="21.5" cy="16" r="2" fill="#38bdf8" />
            <circle cx="15" cy="21.5" r="1.2" fill="#34d399" />
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
