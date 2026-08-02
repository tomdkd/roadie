import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Clock,
  Music,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FileDown,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { SetlistModal } from '../modals/SetlistModal/SetlistModal';
import type { Song } from '../modals/SetlistModal/SetlistModal';
import type { SetlistItem } from '../modals/SetlistModal/SetlistModal';

export interface Setlist {
  id: string;
  title: string;
  songCount: number;
  totalDuration: string;
  status: 'validated' | 'draft' | 'archived';
  items?: SetlistItem[];
}

const REPERTOIRE_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    album: 'City Lights (2025)',
    duration: '04:15',
    tuning: 'Standard (E)',
  },
  {
    id: '2',
    title: 'Midnight Run',
    album: 'City Lights (2025)',
    duration: '03:48',
    tuning: 'Drop D',
  },
  {
    id: '3',
    title: 'Electric Velvet',
    album: 'Electric Velvet - Expanded Edition',
    duration: '05:02',
    tuning: 'Standard (E)',
  },
  {
    id: '4',
    title: 'Starlight Groove',
    album: 'First Demo',
    duration: '03:30',
    tuning: 'Standard (E)',
  },
  {
    id: '5',
    title: 'Unreleased Jam #4',
    album: 'Inédit',
    duration: '02:45',
    tuning: 'Drop D',
  },
];

const INITIAL_SETLISTS: Setlist[] = [
  {
    id: '1',
    title: 'Tournée Été 2026 - Set Principal',
    songCount: 14,
    totalDuration: '01:15:00',
    status: 'validated',
  },
  {
    id: '2',
    title: 'Set acoustique / Radio',
    songCount: 6,
    totalDuration: '00:28:30',
    status: 'validated',
  },
  {
    id: '3',
    title: 'Répète préparation Album #2',
    songCount: 10,
    totalDuration: '00:52:10',
    status: 'draft',
  },
];

export function SetlistsPage() {
  const [setlists, setSetlists] = useState<Setlist[]>(INITIAL_SETLISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSetlists = setlists.filter((setlist) => {
    const matchesSearch = setlist.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || setlist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveSetlist = (data: {
    title: string;
    items: SetlistItem[];
    totalDuration: string;
  }) => {
    const songsOnly = data.items.filter((i) => i.type === 'song');
    const newSetlist: Setlist = {
      id: Date.now().toString(),
      title: data.title,
      songCount: songsOnly.length,
      totalDuration: data.totalDuration,
      status: 'draft',
      items: data.items,
    };
    setSetlists([newSetlist, ...setlists]);
  };

  const handleDelete = (id: string) => {
    setSetlists(setlists.filter((s) => s.id !== id));
    setActiveMenuId(null);
  };

  // 🖨️ FONCTION D'EXPORTATION PDF / IMPRESSION SCÈNE
  const handleExportPDF = (setlist: Setlist) => {
    setActiveMenuId(null);
    
    // Création d'une fenêtre d'impression optimisée scène
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Setlist - ${setlist.title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #000; }
            h1 { font-size: 28px; font-weight: 900; margin-bottom: 5px; text-transform: uppercase; }
            .meta { font-size: 14px; color: #666; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ddd; font-size: 18px; font-weight: bold; }
            .note { background: #f0f4ff; padding: 10px 15px; border-radius: 8px; margin: 8px 0; font-style: italic; font-size: 14px; color: #334155; }
            .tuning { font-size: 12px; color: #d97706; background: #fef3c7; padding: 4px 8px; border-radius: 4px; margin: 6px 0; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${setlist.title}</h1>
          <div class="meta">Roadie Setlist • ${setlist.songCount} Morceaux • Durée estimée : ${setlist.totalDuration}</div>
          <div class="list">
            ${
              setlist.items && setlist.items.length > 0
                ? setlist.items
                    .map((item, _idx) => {
                      if (item.type === 'song') {
                        return `<div class="item"><span>${item.data.title} <small style="font-weight:normal; font-size:13px; color:#666;">(${item.data.tuning})</small></span> <span>${item.data.duration}</span></div>`;
                      } else {
                        return `<div class="note">💬 ${item.content}</div>`;
                      }
                    })
                    .join('')
                : '<p>Visualisation standard de la setlist</p>'
            }
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status: Setlist['status']) => {
    switch (status) {
      case 'validated':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            Validée
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            Brouillon
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Archivée
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto pr-1">
      {/* EN-TÊTE */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
          Setlists
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {setlists.length} setlists enregistrées.
        </p>
      </div>

      {/* BARRE D'ACTIONS */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une setlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 truncate"
            >
              <option value="all">Tous les statuts</option>
              <option value="validated">Validées</option>
              <option value="draft">Brouillons</option>
              <option value="archived">Archivées</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto justify-center gap-1.5 py-2 px-3 text-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Créer une setlist</span>
          </Button>
        </div>
      </div>

      {/* GRILLE DES SETLISTS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSetlists.map((setlist) => (
          <div
            key={setlist.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-500 transition-colors">
                {setlist.title}
              </span>
              <div className="shrink-0">{getStatusBadge(setlist.status)}</div>
            </div>

            <div className="my-4 border-t border-slate-100 dark:border-slate-800/80" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5" title="Nombre de morceaux">
                  <Music className="h-3.5 w-3.5 text-slate-400" />
                  <span>{setlist.songCount} titres</span>
                </div>
                <div className="flex items-center gap-1.5" title="Durée totale estimée">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{setlist.totalDuration}</span>
                </div>
              </div>

              {/* BOUTONS D'ACTIONS (PDF + MENU 3 POINTS) */}
              <div className="flex items-center gap-1 relative">
                {/* BOUTON RAPIDE EXPORT PDF */}
                <button
                  type="button"
                  onClick={() => handleExportPDF(setlist)}
                  title="Exporter / Imprimer en PDF"
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                </button>

                {/* MENU REROULANT 3 POINTS */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenuId(activeMenuId === setlist.id ? null : setlist.id)
                  }
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {activeMenuId === setlist.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 bottom-8 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(null)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>Voir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(null)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-slate-400" />
                      <span>Modifier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportPDF(setlist)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors"
                    >
                      <FileDown className="h-3.5 w-3.5 text-blue-500" />
                      <span>Exporter PDF</span>
                    </button>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                    <button
                      type="button"
                      onClick={() => handleDelete(setlist.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SetlistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveSetlist}
        availableSongs={REPERTOIRE_SONGS}
      />
    </div>
  );
}