import { Sparkles, X, Globe, Music2, Share2, ArrowRight, Bot } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface CreateEpkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function CreateEpkModal({ isOpen, onClose, onStart }: CreateEpkModalProps) {
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Qu'est-ce qu'un EPK ?
            </h2>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Electronic Press Kit
            </p>
          </div>
        </div>

        {/* Description concise & pédagogique */}
        <div className="mt-5 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
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
            className="py-2 px-4 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border-none font-bold"
          >
            <span>Commencer</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}