import { Copy, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function IntegrationsTab() {
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Lien d'agenda copié dans le presse-papier ! 📋");
  };

  return (
    <div className="max-w-3xl flex-1 space-y-4 overflow-y-auto pr-1">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Synchronisation de l'agenda (.ics)
        </h2>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Copie ce lien iCal unique pour synchroniser automatiquement les dates
          de concerts et balances de <strong>The Neon Monkeys</strong> avec ton
          application calendrier (Google Calendar, Apple Calendar, Outlook).
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value="https://api.roadie.app/v1/projects/neon-monkeys/calendar.ics?token=xyz123"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          />
          <Button
            variant="outline"
            className="shrink-0 gap-1.5"
            onClick={() =>
              handleCopyCode(
                'https://api.roadie.app/v1/projects/neon-monkeys/calendar.ics?token=xyz123',
              )
            }
          >
            <Copy className="h-3.5 w-3.5" />
            Copier
          </Button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/30 p-5 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="text-sm font-bold">Zone de danger</h2>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          La suppression d'un projet est une action irréversible. Toutes les
          setlists, documents, fiches techniques et données d'audiences
          rattachées à ce groupe seront définitivement détruits.
        </p>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Supprimer définitivement le projet
        </button>
      </div>
    </div>
  );
}
