import { TrendingUp, TrendingDown } from 'lucide-react';

export interface PlatformStat {
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

interface StreamingPlatformCardProps {
  platform: PlatformStat;
}

export function StreamingPlatformCard({ platform }: StreamingPlatformCardProps) {
  const TrendIcon = platform.isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:border-slate-700">
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
}