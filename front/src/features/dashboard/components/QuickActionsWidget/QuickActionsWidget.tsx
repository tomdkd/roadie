import {
  Zap,
  CalendarPlus,
  Music,
  FileDown,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export function QuickActionsWidget() {
  const handleDownloadPressKit = () => {
    console.log('Téléchargement du Press-kit...');
  };

  const handleDownloadTechRider = () => {
    console.log('Téléchargement de la Fiche Technique...');
  };

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* En-tête du Widget */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Actions Rapides
            </h3>
          </div>
        </div>

        {/* Liste des 4 Actions */}
        <div className="space-y-2.5">
          {/* 1. Ajouter un concert */}
          <button
            type="button"
            onClick={() => console.log('Ajouter un concert')}
            className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-blue-500/50 hover:bg-blue-50/50 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-blue-500/50 dark:hover:bg-blue-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <CalendarPlus className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Ajouter un concert
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* 2. Ajouter un morceau */}
          <button
            type="button"
            onClick={() => console.log('Ajouter un morceau')}
            className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Music className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Ajouter un morceau
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* 3. Télécharger le Press-kit */}
          <button
            type="button"
            onClick={handleDownloadPressKit}
            className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-purple-500/50 hover:bg-purple-50/50 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-purple-500/50 dark:hover:bg-purple-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <FileDown className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Télécharger le Press-kit
              </span>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
              PDF
            </span>
          </button>

          {/* 4. Télécharger la fiche technique */}
          <button
            type="button"
            onClick={handleDownloadTechRider}
            className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Sliders className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Fiche technique (Rider)
              </span>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              PDF
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
