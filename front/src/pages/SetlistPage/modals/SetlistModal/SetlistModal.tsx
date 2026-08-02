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
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export interface Song {
  id: string;
  title: string;
  duration: string;
  tuning: string;
  album?: string;
}

interface SetlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (setlistData: {
    title: string;
    songs: Song[];
    totalDuration: string;
  }) => void;
  availableSongs: Song[];
}

function durationToSeconds(durationStr: string): number {
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
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Onglet actif pour le mobile ('setlist' ou 'repertoire')
  const [activeTab, setActiveTab] = useState<'setlist' | 'repertoire'>('setlist');

  const totalDurationStr = useMemo(() => {
    const totalSeconds = selectedSongs.reduce(
      (acc, song) => acc + durationToSeconds(song.duration),
      0
    );
    return secondsToFormattedDuration(totalSeconds);
  }, [selectedSongs]);

  const filteredAvailableSongs = useMemo(() => {
    return availableSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [availableSongs, searchQuery]);

  if (!isOpen) return null;

  const handleAddSong = (song: Song) => {
    setSelectedSongs((prev) => [...prev, song]);
  };

  const handleRemoveSong = (indexToRemove: number) => {
    setSelectedSongs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...selectedSongs];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSelectedSongs(updated);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      songs: selectedSongs,
      totalDuration: totalDurationStr,
    });

    setTitle('');
    setSelectedSongs([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-0 sm:p-4 md:p-6 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-5xl flex-col rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        
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
                  Organise l'ordre et les enchaînements de ton concert.
                </p>
              </div>
            </div>

            {/* TIMER ET BOUTON FERMER */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>{totalDurationStr}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* SYSTEME D'ONGLETS POUR MOBILE ONLY */}
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
              <span>Setlist ({selectedSongs.length})</span>
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

        {/* CORPS : SWAP DYNAMIQUE MOBILE vs 2 COLONNES DESKTOP */}
        <div className="flex flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* COLONNE GAUCHE : SETLIST EN CONSTRUCTION */}
          <div
            className={`flex flex-1 flex-col bg-slate-50/50 p-3 sm:p-4 dark:bg-slate-900/50 overflow-hidden ${
              activeTab === 'setlist' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <div className="mb-3">
              <Input
                label="Nom de la setlist"
                placeholder="Ex: Main Stage Festival..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="hidden md:flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ordre des morceaux ({selectedSongs.length})
              </span>
            </div>

            {/* LISTE DES MORCEAUX SELECTIONNÉS */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {selectedSongs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                  <ListMusic className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Ta setlist est encore vide.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('repertoire')}
                    className="mt-2 text-xs font-bold text-blue-600 md:hidden dark:text-blue-400"
                  >
                    + Ajouter des morceaux depuis le répertoire
                  </button>
                </div>
              ) : (
                selectedSongs.map((song, index) => {
                  const prevSong = index > 0 ? selectedSongs[index - 1] : null;
                  const hasTuningChange =
                    prevSong && prevSong.tuning !== song.tuning;

                  return (
                    <div key={`${song.id}-${index}`} className="space-y-2">
                      {hasTuningChange && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-[11px] italic font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 my-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Changement d'accordage : <strong>{song.tuning}</strong>
                          </span>
                        </div>
                      )}

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
                            {index + 1}.
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                              {song.title}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {song.tuning}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            {song.duration}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSong(index)}
                            className="text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLONNE DROITE : RÉPERTOIRE (ACCESSIBLE PAR ONGLET SUR MOBILE) */}
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
          <Button variant="outline" type="button" onClick={onClose} className="py-1.5 text-xs">
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="py-1.5 text-xs" disabled={!title || selectedSongs.length === 0}>
            Enregistrer la setlist
          </Button>
        </div>
      </div>
    </div>
  );
}