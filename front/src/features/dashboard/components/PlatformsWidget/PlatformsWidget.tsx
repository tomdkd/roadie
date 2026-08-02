import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface PlatformStat {
  id: string;
  name: string;
  shortName: string;
  listeners: string;
  subscribers: string;
  trend: string;
  isPositive: boolean;
  color: string;
  bgColor: string;
  textColor: string;
}

const PLATFORM_STATS: PlatformStat[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    shortName: 'S',
    listeners: '42,850',
    subscribers: '12,400',
    trend: '+14.2%',
    isPositive: true,
    color: '#1DB954',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'deezer',
    name: 'Deezer',
    shortName: 'D',
    listeners: '18,320',
    subscribers: '4,150',
    trend: '+5.8%',
    isPositive: true,
    color: '#A238FF',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'apple',
    name: 'Apple Music',
    shortName: 'A',
    listeners: '29,600',
    subscribers: '8,900',
    trend: '-2.1%',
    isPositive: false,
    color: '#FA243C',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    textColor: 'text-rose-600 dark:text-rose-400',
  },
];

export function PlatformsWidget() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      {/* En-tête du Widget */}
      <div className="mb-4 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Audiences & Plateformes
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Mis à jour ce mois-ci
        </span>
      </div>

      {/* Grille des Plateformes (1 col sur Mobile, 3 cols sur Tablette/Desktop) */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {PLATFORM_STATS.map((platform) => {
          const TrendIcon = platform.isPositive ? TrendingUp : TrendingDown;

          return (
            <div
              key={platform.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-slate-700"
            >
              {/* Ligne du haut : Logo + Nom + Tendance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${platform.bgColor} ${platform.textColor}`}
                  >
                    {platform.shortName}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {platform.name}
                  </span>
                </div>

                {/* Badge Tendance */}
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    platform.isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{platform.trend}</span>
                </div>
              </div>

              {/* Ligne du bas : Métriques */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 dark:border-slate-800/60">
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Auditeurs/mois
                  </p>
                  <p className="mt-0.5 text-sm font-black text-slate-900 sm:text-base dark:text-white">
                    {platform.listeners}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Abonnés
                  </p>
                  <p className="mt-0.5 text-sm font-black text-slate-900 sm:text-base dark:text-white">
                    {platform.subscribers}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
