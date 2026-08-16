import { Sparkles, Globe, Music2, Share2, Bot } from 'lucide-react';
import { InfoModal } from '../../components/InfoModal';

interface CreateEpkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function CreateEpkModal({ isOpen, onClose, onStart }: CreateEpkModalProps) {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      onStart={onStart}
      title="Qu'est-ce qu'un EPK ?"
      subtitle="Electronic Press Kit"
      icon={<Sparkles className="h-6 w-6" />}
      iconWrapperClassName="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
      subtitleClassName="text-purple-600 dark:text-purple-400"
      startLabel="Commencer"
      startBtnClassName="bg-purple-600 hover:bg-purple-700"
    >
      <p>
        Un <strong className="text-slate-900 dark:text-white">EPK</strong> est la carte de visite numérique professionnelle de votre groupe. Il rassemble au même endroit tout ce dont les programmateurs de festivals, salles de concert, journalistes et labels ont besoin pour vous découvrir.
      </p>

      <div className="grid grid-cols-1 gap-2.5 pt-1">
        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Globe className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Bio & Photos HD</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Votre histoire, vos membres et vos visuels de presse téléchargeables.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Music2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Audios & Clips vidéo</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Vos meilleurs morceaux et prestations live intégrés.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Share2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Partage en 1 clic</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Un lien interactif unique prêt à être envoyé aux professionnels.</p>
          </div>
        </div>
      </div>

      {/* Encart promotionnel Roadie */}
      <div className="flex items-start gap-3 rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5 dark:border-purple-900/50 dark:bg-purple-950/30">
        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">L'accompagnement Roadie</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
            Pour vous faciliter la tâche, <strong className="text-purple-600 dark:text-purple-400">Roadie</strong> vous guide et vous conseille pas à pas tout au long de la création. Un <strong className="text-slate-900 dark:text-white">outil interactif intelligent</strong> est mis à votre disposition pour concevoir un dossier percutant sans prise de tête !
          </p>
        </div>
      </div>
    </InfoModal>
  );
}
