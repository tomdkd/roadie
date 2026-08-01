import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Users, Radio, Activity } from 'lucide-react';

interface PlatformStat {
  id: string;
  name: string;
  monthlyListeners: string;
  followers: string;
  growth: number; // ex: 12.5 (en %)
  color: {
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
  };
}

const PLATFORM_DATA: PlatformStat[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    monthlyListeners: '42,850',
    followers: '12,400',
    growth: 14.2,
    color: {
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/50',
      glow: 'from-emerald-500/10',
    },
  },
  {
    id: 'deezer',
    name: 'Deezer',
    monthlyListeners: '18,320',
    followers: '4,150',
    growth: 5.8,
    color: {
      badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      badgeText: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/50',
      glow: 'from-purple-500/10',
    },
  },
  {
    id: 'apple',
    name: 'Apple Music',
    monthlyListeners: '29,600',
    followers: '8,900',
    growth: -2.1, // Exemple de tendance à la baisse
    color: {
      badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      badgeText: 'text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-500/50',
      glow: 'from-rose-500/10',
    },
  },
];

export function PlatformsWidget() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
      {/* En-tête du Widget Global */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Audiences & Plateformes
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Mis à jour ce mois-ci
        </span>
      </div>

      {/* Grille des 3 plateformes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_DATA.map((platform) => {
          const isPositive = platform.growth >= 0;

          return (
            <div
              key={platform.id}
              className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all ${platform.color.border} dark:border-slate-800/80 dark:bg-slate-800/30`}
            >
              {/* Entête Carte Plateforme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-black text-xs ${platform.color.badgeBg} ${platform.color.badgeText}`}
                  >
                    {platform.name.charAt(0)}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {platform.name}
                  </span>
                </div>

                {/* Badge évolution (en % vs mois précédent) */}
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {platform.growth}%
                  </span>
                </div>
              </div>

              {/* Chiffres Clés */}
              <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-800">
                {/* Auditeurs mensuels */}
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <Radio className="h-3 w-3" />
                    <span>Auditeurs/mois</span>
                  </div>
                  <p className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                    {platform.monthlyListeners}
                  </p>
                </div>

                {/* Followers */}
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <Users className="h-3 w-3" />
                    <span>Abonnés</span>
                  </div>
                  <p className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                    {platform.followers}
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