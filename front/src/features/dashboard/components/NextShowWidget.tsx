import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Download,
  Music2,
  Clock,
  Car,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface NextShowProps {
  show?: {
    title: string;
    venue: string;
    city: string;
    date: string;
    daysLeft: number;
    arrivalTime: string;
    soundcheckTime: string;
    showTime: string;
    setlistName: string;
    setlistPdfUrl?: string;
  };
}

const DEFAULT_SHOW = {
  title: 'Main Square Festival',
  venue: 'La Citadelle',
  city: 'Arras, FR',
  date: 'Samedi 5 Août 2026',
  daysLeft: 4,
  arrivalTime: '15:00',
  soundcheckTime: '16:30',
  showTime: '21:00',
  setlistName: 'Set Rock Festival - 1h15',
  setlistPdfUrl: '#',
};

export function NextShowWidget({ show = DEFAULT_SHOW }: NextShowProps) {
  const { t } = useTranslation();

  const handleDownloadSetlist = () => {
    console.log(`Téléchargement de la setlist: ${show.setlistName}`);
  };

  const schedule = [
    { label: 'Arrivée', time: show.arrivalTime, icon: Car, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
    { label: 'Balances', time: show.soundcheckTime, icon: Sliders, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50' },
    { label: 'Concert', time: show.showTime, icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Halo lumineux */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      {/* En-tête du Widget */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Prochain Concert
          </h3>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          Dans {show.daysLeft} jours
        </span>
      </div>

      {/* Titre & Lieu */}
      <div className="mt-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
          {show.title}
        </h2>
        <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>{show.venue} • {show.city}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{show.date}</span>
          </div>
        </div>
      </div>

      {/* ⏱️ Timetable / Chronologie déroulante */}
      <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Horaires de la journée
        </p>
        
        <div className="grid grid-cols-3 gap-2 relative">
          {schedule.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm text-center"
              >
                <div className={`p-1.5 rounded-lg ${item.color} mb-1`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Setlist avec Bouton de Téléchargement */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-colors dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Music2 className="h-4 w-4" />
          </div>
          <div className="truncate">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Setlist rattachée
            </p>
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
              {show.setlistName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadSetlist}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
          title="Télécharger la setlist (PDF)"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}