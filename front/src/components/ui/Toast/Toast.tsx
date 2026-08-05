import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ toast, onClose, duration = 4000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Déclaration de handleClose EN PREMIER pour éviter l'erreur d’accès avant déclaration
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // 2. useEffect avec mises à jour exclusivement asynchrones (dans des setTimeout)
  useEffect(() => {
    if (!toast) return;

    // Réinitialisation asynchrone des états d'animation
    const enterTimer = setTimeout(() => {
      setIsExiting(false);
      setIsVisible(true);
    }, 10);

    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [toast, duration, handleClose]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xl transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 max-w-sm sm:max-w-md ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-12 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {toast.type === 'success' && (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      )}
      {toast.type === 'warning' && (
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
      )}
      {toast.type === 'error' && (
        <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
      )}
      {toast.type === 'info' && (
        <Info className="h-5 w-5 text-blue-500 shrink-0" />
      )}

      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 pr-2">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={handleClose}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}