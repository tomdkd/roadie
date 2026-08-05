import { useState, useMemo } from 'react';
import {
  X,
  ListMusic,
  Clock,
  Search,
  GripVertical,
  Trash2,
  AlertCircle,
  Plus,
  Music2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Toast } from '../../../../components/ui/Toast';
import type { ToastMessage } from '../../../../components/ui/Toast';

export interface Song {
  id: string;
  title: string;
  duration: string;
  tuning: string;
  album?: string;
}

// Un élément de la setlist peut être soit un morceau, soit une note (avec une durée optionnelle)
export type SetlistItem =
  | { type: 'song'; data: Song; id: string }
  | { type: 'note'; content: string; duration?: string; id: string };

interface SetlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (setlistData: {
    title: string;
    items: SetlistItem[];
    totalDuration: string;
  }) => void;
  availableSongs: Song[];
}

function durationToSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function secondsToFormattedDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function SetlistModal({
  isOpen,
  onClose,
  onSave,
  availableSongs = [],
}: SetlistModalProps) {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<SetlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Gestion de la création de note avec durée
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteMinutes, setNoteMinutes] = useState('01');
  const [noteSeconds, setNoteSeconds] = useState('00');

  // Gestion du Toast interne
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Onglet actif pour le mobile ('setlist' ou 'repertoire')
  const [activeTab, setActiveTab] = useState<'setlist' | 'repertoire'>('setlist');

  // Calcul dynamique de la durée totale (Chansons + Durées des Notes de scène)
  const totalDurationStr = useMemo(() => {
    const totalSecs = items.reduce((acc, item) => {
      if (item.type === 'song') {
        return acc + durationToSeconds(item.data.duration);
      } else if (item.type === 'note') {
        return acc + durationToSeconds(item.duration);
      }
      return acc;
    }, 0);
    return secondsToFormattedDuration(totalSecs);
  }, [items]);

  const filteredAvailableSongs = useMemo(() => {
    return availableSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [availableSongs, searchQuery]);

  if (!isOpen) return null;

  // Ajouter une chanson (avec détection de doublon)
  const handleAddSong = (song: Song) => {
    const isAlreadyAdded = items.some(
      (item) => item.type === 'song' && item.data.id === song.id
    );

    if (isAlreadyAdded) {
      setToast({
        id: crypto.randomUUID(),
        message: `Le morceau "${song.title}" est déjà présent dans la setlist.`,
        type: 'warning',
      });
    }

    setItems((prev) => [
      ...prev,
      { type: 'song', data: song, id: `${song.id}-${crypto.randomUUID()}` },
    ]);
  };

  // Soumission d'une note avec durée personnalisée
  const handleAddNoteSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) return;

    const m = Math.max(0, parseInt(noteMinutes, 10) || 0);
    const s = Math.min(59, Math.max(0, parseInt(noteSeconds, 10) || 0));
    const pad = (num: number) => num.toString().padStart(2, '0');
    const formattedNoteDuration = `${pad(m)}:${pad(s)}`;

    setItems((prev) => [
      ...prev,
      {
        type: 'note',
        content: noteText.trim(),
        duration: formattedNoteDuration !== '00:00' ? formattedNoteDuration : undefined,
        id: `note-${crypto.randomUUID()}`,
      },
    ]);

    setNoteText('');
    setNoteMinutes('01');
    setNoteSeconds('00');
    setIsAddingNote(false);
  };

  // Raccourcis pour insérer des notes rapides avec durées estimées
  const handleQuickNote = (text: string, defaultDuration?: string) => {
    setItems((prev) => [
      ...prev,
      {
        type: 'note',
        content: text,
        duration: defaultDuration,
        id: `note-${crypto.randomUUID()}`,
      },
    ]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Drag & drop
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...items];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setItems(updated);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const handleCloseModal = () => {
    setToast(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      items,
      totalDuration: totalDurationStr,
    });

    setTitle('');
    setItems([]);
    setToast(null);
    onClose();
  };

  const songCount = items.filter((i) => i.type === 'song').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-0 sm:p-4 md:p-6 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-5xl flex-col rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        
        {/* HEADER RESPONSIVE */}
        <div className="flex flex-col border-b border-slate-100 p-3 sm:px-5 sm:py-3.5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <ListMusic className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Créer une setlist
                </h3>
                <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                  Organise les morceaux, intermèdes et notes de scène.
                </p>
              </div>
            </div>

            {/* TIMER ET BOUTON FERMER */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200" title="Durée totale avec notes">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>{totalDurationStr}</span>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ONGLET MOBILE */}
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 md:hidden dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveTab('setlist')}
              className={`flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === 'setlist'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ListMusic className="h-3.5 w-3.5" />
              <span>Setlist ({songCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('repertoire')}
              className={`flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === 'repertoire'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Music2 className="h-3.5 w-3.5" />
              <span>Répertoire</span>
            </button>
          </div>
        </div>

        {/* CORPS DE LA MODALE */}
        <div className="flex flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* COLONNE GAUCHE : SETLIST */}
          <div
            className={`flex flex-1 flex-col bg-slate-50/50 p-3 sm:p-4 dark:bg-slate-900/50 overflow-hidden ${
              activeTab === 'setlist' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <div className="mb-3 space-y-2">
              <Input
                label="Nom de la setlist"
                placeholder="Ex: Main Stage Festival..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* BARRE D'ACTION NOTES & RACCOURCIS */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>+ Remarque / Note de scène</span>
                </button>

                {/* Quick notes avec durées estimées */}
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickNote('⚡ Enchaînement direct', '00:15')}
                    className="rounded-md bg-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    ⚡ Enchaînement direct (+15s)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('🎤 Présentation / Discours', '02:00')}
                    className="rounded-md bg-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    🎤 Speach public (+2m)
                  </button>
                </div>
              </div>

              {/* FORMULAIRE DE CRÉATION DE NOTE AVEC DURÉE */}
              {isAddingNote && (
                <form
                  onSubmit={handleAddNoteSubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/30 p-2 dark:border-blue-900/40 dark:bg-blue-950/20"
                >
                  <input
                    type="text"
                    placeholder="Ex: Speach du chanteur ou accordage..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    autoFocus
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />

                  {/* Saisie de la durée (Min : Sec) */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Durée:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={noteMinutes}
                      onChange={(e) => setNoteMinutes(e.target.value)}
                      className="w-10 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      placeholder="mm"
                    />
                    <span className="text-xs font-bold text-slate-400">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={noteSeconds}
                      onChange={(e) => setNoteSeconds(e.target.value)}
                      className="w-10 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      placeholder="ss"
                    />
                    <Button type="submit" className="py-1 px-2.5 text-xs shrink-0 ml-1">
                      Ajouter
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* EN-TÊTE DE LA LISTE */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ordre du concert ({songCount} titres)
              </span>
            </div>

            {/* LISTE DES ÉLÉMENTS (CHANSONS + NOTES) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                  <ListMusic className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Ta setlist est encore vide.
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Ajoute des morceaux depuis le répertoire ou crée une note.
                  </p>
                </div>
              ) : (
                items.map((item, index) => {
                  let prevSong: Song | null = null;
                  if (item.type === 'song') {
                    for (let i = index - 1; i >= 0; i--) {
                      if (items[i].type === 'song') {
                        prevSong = (items[i] as { type: 'song'; data: Song }).data;
                        break;
                      }
                    }
                  }

                  const hasTuningChange =
                    item.type === 'song' &&
                    prevSong &&
                    prevSong.tuning !== item.data.tuning;

                  return (
                    <div key={item.id} className="space-y-2">
                      {hasTuningChange && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-[11px] italic font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 my-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Changement d'accordage :{' '}
                            <strong>{item.data.tuning}</strong>
                          </span>
                        </div>
                      )}

                      {item.type === 'song' ? (
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900 ${
                            draggedIndex === index
                              ? 'opacity-40 border-blue-500'
                              : 'hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              className="cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4" />
                            </button>
                            <span className="w-4 font-mono text-xs font-bold text-slate-400">
                              {
                                items
                                  .slice(0, index + 1)
                                  .filter((i) => i.type === 'song').length
                              }
                              .
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.data.title}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.data.tuning}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                              {item.data.duration}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* AFFICHAGE NOTE AVEC SA DURÉE */
                        <div
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`group flex items-center justify-between rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-2.5 shadow-xs transition-all dark:border-indigo-900/40 dark:bg-indigo-950/30 ${
                            draggedIndex === index
                              ? 'opacity-40 border-indigo-500'
                              : 'hover:border-indigo-300 dark:hover:border-indigo-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 pr-2">
                            <button
                              type="button"
                              className="cursor-grab text-indigo-300 hover:text-indigo-500 dark:text-indigo-700 dark:hover:text-indigo-500 active:cursor-grabbing shrink-0"
                            >
                              <GripVertical className="h-4 w-4" />
                            </button>
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <p className="text-xs font-medium italic text-indigo-950 dark:text-indigo-200 line-clamp-2">
                              {item.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {item.duration && (
                              <span className="font-mono text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40 px-1.5 py-0.5 rounded">
                                +{item.duration}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-indigo-300 hover:text-rose-500 dark:text-indigo-700 dark:hover:text-rose-400 transition-colors ml-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLONNE DROITE : RÉPERTOIRE */}
          <div
            className={`flex w-full flex-col bg-white p-3 sm:p-4 dark:bg-slate-900 overflow-hidden md:w-80 lg:w-96 ${
              activeTab === 'repertoire' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <div className="mb-2 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Répertoire du groupe
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Touche un morceau pour l'ajouter.
              </p>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Chercher un titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
              {filteredAvailableSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => handleAddSong(song)}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-left transition-all hover:border-blue-500/50 hover:bg-blue-50/30 dark:border-slate-800/60 dark:bg-slate-800/30 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/20 active:scale-[0.99]"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                      {song.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {song.tuning}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">
                      {song.duration}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:group-hover:border-blue-400 dark:group-hover:text-blue-400">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white p-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900">
          <Button variant="outline" type="button" onClick={handleCloseModal} className="py-1.5 text-xs">
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="py-1.5 text-xs" disabled={!title || items.length === 0}>
            Enregistrer la setlist
          </Button>
        </div>

        {/* TOAST D'AVERTISSEMENT */}
        <Toast key={toast?.id} toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
}