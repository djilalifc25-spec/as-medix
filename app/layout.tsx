import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { FacultyProvider } from '@/components/context/FacultyContext';
import { ToastProvider } from '@/components/context/ToastContext';
import { SpecialtyThemeProvider } from '@/components/context/SpecialtyThemeContext';
import { SpecialtyBackgroundOverlay } from '@/components/theme/SpecialtyBackgroundOverlay';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070b14' },
  ],
};

export const metadata: Metadata = {
  title: 'AS MEDIX | La Plateforme Médicale d\'Excellence en Algérie',
  description: 'Cours medicaux complets, fiches de revision, QCM interactifs ECNi/Residanat, outils pour etudiants et medecins algeriens.',
  keywords: ['médecine algérie', 'résidanat algérie', 'cours médecine', 'QCM médecine', 'ECNi', 'conduite à tenir', 'ECG', 'tuberculose', 'cardiologie', 'garde urgences'],
  authors: [{ name: 'AS MEDIX HealthTech' }],
  manifest: '/manifest.json?v=5',
  icons: {
    icon: [
      { url: '/icons/icon-192.png?v=5', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png?v=5', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon-512.svg?v=5', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/icon-192.png?v=5',
    apple: [
      { url: '/icons/apple-touch-icon.png?v=5', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AS MEDIX',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'AS MEDIX - Learn • Practice • Excel',
    description: 'La première plateforme d\'apprentissage médical conçue pour les carabins et praticiens en Algérie.',
    type: 'website',
    locale: 'fr_DZ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.png?v=5" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=5" />
        <link rel="icon" href="/icons/icon-512.svg?v=5" type="image/svg+xml" />
        {/* Auto-recover from stale chunks or CSS 404s after new Vercel deployments */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  window.addEventListener('error', function(e) {
                    var target = e && e.target;
                    if (target && (target.tagName === 'LINK' || target.tagName === 'SCRIPT')) {
                      var url = target.href || target.src || '';
                      if (url.indexOf('/_next/static/') !== -1) {
                        var last = sessionStorage.getItem('asmedix_chunk_recover');
                        var now = Date.now();
                        if (!last || now - parseInt(last, 10) > 10000) {
                          sessionStorage.setItem('asmedix_chunk_recover', String(now));
                          window.location.reload();
                        }
                      }
                    }
                  }, true);
                  window.addEventListener('unhandledrejection', function(e) {
                    var reason = e && (e.reason && (e.reason.message || e.reason.name) || String(e.reason || ''));
                    if (
                      reason.indexOf('ChunkLoadError') !== -1 ||
                      reason.indexOf('Loading chunk') !== -1 ||
                      reason.indexOf('Failed to fetch') !== -1
                    ) {
                      var last = sessionStorage.getItem('asmedix_chunk_recover');
                      var now = Date.now();
                      if (!last || now - parseInt(last, 10) > 10000) {
                        sessionStorage.setItem('asmedix_chunk_recover', String(now));
                        window.location.reload();
                      }
                    }
                  });
                } catch (err) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} font-sans min-h-screen text-slate-900 dark:text-slate-100 bg-[#f8fafc] dark:bg-[#070b14] selection:bg-sky-500 selection:text-white relative antialiased transition-colors duration-500 overflow-x-hidden w-full max-w-full`}>
        <ThemeProvider>
          <FacultyProvider>
            <SpecialtyThemeProvider>
              <ToastProvider>
                <SpecialtyBackgroundOverlay />
                <PwaRegister />
                <div className="relative z-10 min-h-screen flex flex-col">
                  {children}
                </div>
                <PwaInstallPrompt />
                <MobileBottomNav />
              </ToastProvider>
            </SpecialtyThemeProvider>
          </FacultyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
