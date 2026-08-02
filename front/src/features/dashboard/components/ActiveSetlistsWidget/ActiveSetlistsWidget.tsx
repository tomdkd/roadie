import { useTranslation } from 'react-i18next';
import { ListMusic, Music, Clock, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Setlist {
  id: string;
  name: string;
  songCount: number;
  duration: string;
}

const DEFAULT_SETLISTS: Setlist[] = [
  {
    id: '1',
    name: "Tournée d'Été 2026",
    songCount: 14,
    duration: '1h15',
  },
  {
    id: '2',
    name: 'Set Festival Rapide',
    songCount: 8,
    duration: '45 min',
  },
  {
    id: '3',
    name: 'Set Acoustique / Club',
    songCount: 18,
    duration: '1h45',
  },
];

export function ActiveSetlistsWidget() {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* En-tête du Widget */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <ListMusic className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Setlists
            </h3>
          </div>
          <Link
            to="/setlists"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>Voir tout</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Liste des Setlists */}
        <div className="mt-4 space-y-2.5">
          {DEFAULT_SETLISTS.map((setlist) => (
            <div
              key={setlist.id}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-blue-500 group-hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <Music className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                    {setlist.name}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {setlist.songCount} morceaux
                  </p>
                </div>
              </div>

              {/* Badge Durée */}
              <div className="ml-2 flex shrink-0 items-center gap-1 rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{setlist.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton d'action rapide pour créer une nouvelle setlist */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 p-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4" />
          <span>Créer une nouvelle setlist</span>
        </button>
      </div>
    </div>
  );
}
