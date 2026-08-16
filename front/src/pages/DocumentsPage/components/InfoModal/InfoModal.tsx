import type { ReactNode } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconWrapperClassName: string;
  subtitleClassName: string;
  startLabel: string;
  startBtnClassName?: string;
  children: ReactNode;
}

export function InfoModal({
  isOpen,
  onClose,
  onStart,
  title,
  subtitle,
  icon,
  iconWrapperClassName,
  subtitleClassName,
  startLabel,
  startBtnClassName,
  children,
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* En-tête Modale */}
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrapperClassName}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className={`text-xs font-semibold ${subtitleClassName}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="mt-5 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Pied de modale */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs py-2 px-3"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={onStart}
            className={`py-2 px-4 text-xs gap-1.5 text-white border-none font-bold ${startBtnClassName ?? ''}`}
          >
            <span>{startLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
