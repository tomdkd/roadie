import { Sliders, Layout, Zap, Bot } from 'lucide-react';
import { InfoModal } from '../../components/InfoModal';

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
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      onStart={onStart}
      title="Qu'est-ce qu'une Fiche Technique ?"
      subtitle="Technical Rider & Stage Plan"
      icon={<Sliders className="h-6 w-6" />}
      iconWrapperClassName="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
      subtitleClassName="text-blue-600 dark:text-blue-400"
      startLabel="Créer la fiche"
      startBtnClassName="bg-blue-600 hover:bg-blue-700"
    >
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
    </InfoModal>
  );
}
