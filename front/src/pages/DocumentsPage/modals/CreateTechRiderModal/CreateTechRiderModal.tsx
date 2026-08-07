import { X, Sliders, Layout, Zap, ArrowRight, Bot } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface CreateTechRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function CreateTechRiderModal({
  isOpen,
  onClose,
  onStart,
}: CreateTechRiderModalProps) {
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Qu'est-ce qu'une Fiche Technique ?
            </h2>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Technical Rider & Stage Plan
            </p>
          </div>
        </div>

        {/* Description concise & pédagogique */}
        <div className="mt-5 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            La <strong className="text-slate-900 dark:text-white">fiche technique</strong> répertorie tous les besoins matériels et logistiques de votre groupe sur scène. C'est le document indispensable transmis aux régisseurs et techniciens des salles pour garantir un son parfait le jour J.
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
              <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Patch Line & Micros</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Liste détaillée de vos entrées console, micros souhaités et retours.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
              <Layout className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Plan de Scène (Stage Plan)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Disposition visuelle exacte des musiciens, amplis et prises électriques.</p>
              </div>
            </div>
          </div>

          {/* Encart promotionnel Roadie */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">L'assistance intelligente Roadie</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                Pas besoin d'être ingénieur du son ! <strong className="text-blue-600 dark:text-blue-400">Roadie</strong> vous accompagne pas à pas pour construire votre patch line et générer un <strong className="text-slate-900 dark:text-white">plan de scène interactif</strong> clair et conforme aux standards professionnels.
              </p>
            </div>
          </div>
        </div>

        {/* Pied de modale */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="text-xs py-2 px-3"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={onStart}
            className="py-2 px-4 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-none font-bold"
          >
            <span>Créer la fiche</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}