import { Activity } from 'lucide-react';
import { StreamingPlatformCard } from '../../../../components/ui/StreamingPlatformCard';
import type { PlatformStat } from '../../../../components/ui/StreamingPlatformCard';

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
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-colors sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      {/* En-tête du Widget */}
      <div className="mb-4 flex flex-col justify-between gap-1 sm:mb-6 sm:flex-row sm:items-center">
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

      {/* Grille des Plateformes (1 col mobile, 3 cols desktop) */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        {PLATFORM_STATS.map((platform) => (
          <StreamingPlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
}