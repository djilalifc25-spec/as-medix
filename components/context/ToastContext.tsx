'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showEmptySourceToast: (sourceName: string, courseTitle?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  showEmptySourceToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setToast(null), 300);
    }, options.duration || 4500);

    return () => clearTimeout(timer);
  }, []);

  const showEmptySourceToast = useCallback((sourceName: string, courseTitle?: string) => {
    showToast({
      title: 'Aucun QCM disponible',
      message: courseTitle
        ? `La source « ${sourceName} » ne contient encore aucun QCM pour le cours « ${courseTitle} ».`
        : `Aucune question n'est encore rattachée à la source « ${sourceName} ».`,
      type: 'warning',
      duration: 5000,
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showEmptySourceToast }}>
      {children}

      {/* Floating Animated Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] max-w-md w-[calc(100vw-3rem)] pointer-events-auto transition-all duration-300 ease-out transform ${
            visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}
        >
          <div className="p-4 rounded-3xl bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-navy-700 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-xs ${
              toast.type === 'warning'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                : toast.type === 'error'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                : toast.type === 'success'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
            }`}>
              {toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              {toast.title && (
                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    setVisible(false);
                  }}
                  className="mt-2 text-[11px] font-bold text-blue-600 hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
