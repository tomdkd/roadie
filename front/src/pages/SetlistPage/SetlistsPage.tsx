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
  User,
  Calendar,
  FolderOpen,
  FilterX,
  Send,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Toast, type ToastMessage, type ToastType } from '../../components/ui/Toast';
import { SetlistModal } from './modals/SetlistModal/SetlistModal';
import type { Song } from './modals/SetlistModal/SetlistModal';
import type { SetlistItem } from './modals/SetlistModal/SetlistModal';

export interface Setlist {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  songCount: number;
  totalDuration: string;
  status: 'validated' | 'to_validate' | 'draft' | 'archived';
  items?: SetlistItem[];
}

const PROJECT_MEMBERS = [
  'Jimi Hendrix',
  'Alex Turner',
  'Dave Grohl',
  'Paul McCartney',
];

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
    title: 'Proposition Festival Hellfest',
    author: 'Alex Turner',
    createdAt: '2026-08-01',
    songCount: 12,
    totalDuration: '01:02:15',
    status: 'to_validate',
  },
  {
    id: '2',
    title: 'Tournée Été 2026 - Set Principal',
    author: 'Jimi Hendrix',
    createdAt: '2026-07-10',
    songCount: 14,
    totalDuration: '01:15:00',
    status: 'validated',
  },
  {
    id: '3',
    title: 'Set acoustique / Radio',
    author: 'Jimi Hendrix',
    createdAt: '2026-05-18',
    songCount: 6,
    totalDuration: '00:28:30',
    status: 'archived',
  },
  {
    id: '4',
    title: 'Répète préparation Album #2',
    author: 'Alex Turner',
    createdAt: '2026-04-02',
    songCount: 10,
    totalDuration: '00:52:10',
    status: 'draft',
  },
];

export function SetlistsPage() {
  const [setlists, setSetlists] = useState<Setlist[]>(INITIAL_SETLISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // État local du Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

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

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAuthorFilter('all');
  };

  const filteredSetlists = setlists
    .filter((setlist) => {
      const matchesSearch =
        setlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        setlist.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || setlist.status === statusFilter;
      const matchesAuthor =
        authorFilter === 'all' || setlist.author === authorFilter;

      return matchesSearch && matchesStatus && matchesAuthor;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleSaveSetlist = (data: {
    title: string;
    items: SetlistItem[];
    totalDuration: string;
  }) => {
    const songsOnly = data.items.filter((i) => i.type === 'song');
    const today = new Date().toISOString().split('T')[0];
    const newSetlist: Setlist = {
      id: Date.now().toString(),
      title: data.title,
      author: 'Jimi Hendrix',
      createdAt: today,
      songCount: songsOnly.length,
      totalDuration: data.totalDuration,
      status: 'draft',
      items: data.items,
    };
    setSetlists([newSetlist, ...setlists]);
    showToast('La setlist a été créée avec succès.', 'success');
  };

  const handleSubmitToMembers = (setlistId: string) => {
    setActiveMenuId(null);
    setSetlists((prev) =>
      prev.map((item) =>
        item.id === setlistId ? { ...item, status: 'to_validate' } : item
      )
    );
    showToast(
      'La setlist a été proposée à tous les membres du projet pour validation.',
      'success'
    );
  };

  const handleDelete = (id: string) => {
    setSetlists(setlists.filter((s) => s.id !== id));
    setActiveMenuId(null);
    showToast('La setlist a été supprimée.', 'info');
  };

  const handleExportPDF = (setlist: Setlist) => {
    setActiveMenuId(null);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedDate = new Date(setlist.createdAt).toLocaleDateString(
      'fr-FR',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Setlist - ${setlist.title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #000; }
            h1 { font-size: 28px; font-weight: 900; margin-bottom: 5px; text-transform: uppercase; }
            .meta { font-size: 13px; color: #555; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 8px; }
            .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ddd; font-size: 18px; font-weight: bold; }
            .note { background: #f0f4ff; padding: 10px 15px; border-radius: 8px; margin: 8px 0; font-style: italic; font-size: 14px; color: #334155; }
          </style>
        </head>
        <body>
          <h1>${setlist.title}</h1>
          <div class="meta">Créée par <strong>${setlist.author}</strong> le ${formattedDate} • ${setlist.songCount} Morceaux • Durée estimée : ${setlist.totalDuration}</div>
          <div class="list">
            ${
              setlist.items && setlist.items.length > 0
                ? setlist.items
                    .map((item) => {
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
      case 'to_validate':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            À valider
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

  const isFilterActive =
    searchQuery !== '' || statusFilter !== 'all' || authorFilter !== 'all';

  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-y-auto pr-1">
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
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
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
              <option value="to_validate">À valider</option>
              <option value="draft">Brouillons</option>
              <option value="archived">Archivées</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 truncate"
            >
              <option value="all">Tous les auteurs</option>
              {PROJECT_MEMBERS.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="col-span-2 sm:col-auto w-full sm:w-auto justify-center gap-1.5 py-2 px-3 text-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Créer une setlist</span>
          </Button>
        </div>
      </div>

      {/* GRILLE DES SETLISTS */}
      {filteredSetlists.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSetlists.map((setlist) => (
            <div
              key={setlist.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-500 transition-colors">
                    {setlist.title}
                  </span>
                  <div className="shrink-0">{getStatusBadge(setlist.status)}</div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1" title="Auteur">
                    <User className="h-3 w-3" />
                    <span>{setlist.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1" title="Date de création">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(setlist.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-3 border-t border-slate-100 dark:border-slate-800/80" />

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

                <div className="flex items-center gap-1 relative">
                  <button
                    type="button"
                    onClick={() => handleExportPDF(setlist)}
                    title="Exporter / Imprimer en PDF"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                  </button>

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
                      className="absolute right-0 bottom-8 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
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
                        onClick={() => handleSubmitToMembers(setlist.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5 text-blue-500" />
                        <span>Soumettre</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportPDF(setlist)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FileDown className="h-3.5 w-3.5 text-slate-400" />
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
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40 my-4">
          {isFilterActive ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
                <FilterX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aucune setlist trouvée
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Aucun résultat ne correspond à tes critères de recherche.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="py-1.5 px-3 text-xs mt-2"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aucune setlist créée
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Prépare tes prestations scéniques en créant ta première setlist.
                </p>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="py-1.5 px-3 text-xs mt-2 gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Créer une setlist</span>
              </Button>
            </div>
          )}
        </div>
      )}

      <SetlistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveSetlist}
        availableSongs={REPERTOIRE_SONGS}
      />

      {/* COMPOSANT TOAST REUTILISABLE */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}