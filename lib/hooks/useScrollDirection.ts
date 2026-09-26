'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * useScrollDirection:
 * - Scrolling down -> hides nav (isVisible = false) so user has full screen to read.
 * - Does NOT popup in the middle of reading/page.
 * - When user reaches the END OF THE PAGE (bottom) -> appears (isVisible = true).
 * - When user scrolls UP (wants navigation) -> appears (isVisible = true).
 * - Always visible when at the top of the page (< 40px).
 */
export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const threshold = 8; // Small threshold to detect intentional scroll

    const checkIsAtBottom = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      // Reached within 60px of the end/bottom of the page
      return scrollY + windowHeight >= fullHeight - 60;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // 1. Always visible near top of page
      if (currentScrollY < 40) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Always visible when user reaches the END of the page
      if (checkIsAtBottom()) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // 3. Scrolling down in the middle of the page -> hide
      if (diff > threshold) {
        setIsVisible(false);
      }
      // 4. Scrolling up -> appear immediately
      else if (diff < -threshold) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isVisible;
}

