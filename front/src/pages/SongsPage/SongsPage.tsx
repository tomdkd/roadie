import { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  Gauge,
  MoreVertical,
  ChevronDown,
  Disc,
  Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { SongModal } from './modals/SongModal';
import type { SongForm } from './modals/SongModal/SongModal';
import { SongsProvider, type Song } from './providers/SongsProvider';

export type { Song };

export function SongsPage() {
  const { t } = useTranslation();
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    SongsProvider.getSongs().then(setSongs);
  }, []);

  // Filtrage
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || song.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSong = (newSongData: SongForm) => {
    const newSong: Song = {
      id: Date.now().toString(),
      title: newSongData.title || 'Untitled',
      album: newSongData.album || 'Inédit',
      duration: newSongData.duration || '03:30',
      bpm: parseInt(newSongData.bpm) || 120,
      key: newSongData.key || 'C',
      tuning: newSongData.tuning || 'Standard (E)',
      status: (newSongData.status as Song['status']) || 'ready',
    };
    setSongs([newSong, ...songs]);
  };

  const getStatusBadge = (status: Song['status']) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            {t('songsPage.status.ready')}
          </span>
        );
      case 'rehearsal':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            {t('songsPage.status.rehearsal')}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {t('songsPage.status.draft')}
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto pr-1">
      {/* EN-TÊTE */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
          {t('songsPage.header.title')}
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {t('songsPage.header.description', { count: songs.length })}
        </p>
      </div>

      {/* BARRE D'ACTIONS : OPTIMISÉE MOBILE & DESKTOP */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* LIGNE 1 MOBILE : RECHERCHE PLEINE LARGEUR */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('songsPage.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* LIGNE 2 MOBILE : LES 2 BOUTONS CÔTE À CÔTE (50% / 50%) */}
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          {/* Select Filtre */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 truncate"
            >
              <option value="all">{t('songsPage.filters.allStatus')}</option>
              <option value="ready">{t('songsPage.status.ready')}</option>
              <option value="rehearsal">{t('songsPage.status.rehearsal')}</option>
              <option value="draft">{t('songsPage.status.draft')}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Bouton Ajouter une chanson */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto justify-center gap-1.5 py-2 px-3 text-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>{t('songsPage.actions.addSong')}</span>
          </Button>
        </div>
      </div>

      {/* TABLEAU DES MORCEAUX */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
              <tr>
                <th className="py-3 px-4 font-bold text-left">{t('songsPage.table.title')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.album')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.status')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.duration')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.tempo')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.key')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.tuning')}</th>
                <th className="py-3 px-4 font-bold text-center">{t('songsPage.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSongs.map((song) => (
                <tr
                  key={song.id}
                  className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {/* TITRE */}
                  <td className="py-3.5 px-4 text-left font-bold text-slate-900 dark:text-white">
                    {song.title}
                  </td>

                  {/* ALBUM / SINGLE (TRONQUÉ À ~20 CARACTÈRES) */}
                  <td className="py-3.5 px-4 text-center">
                    <div
                      title={song.album}
                      className="inline-flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 max-w-[140px] truncate"
                    >
                      <Disc className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {song.album.length > 20
                          ? `${song.album.substring(0, 20)}...`
                          : song.album}
                      </span>
                    </div>
                  </td>

                  {/* STATUT */}
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(song.status)}
                  </td>

                  {/* DURÉE */}
                  <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{song.duration}</span>
                    </div>
                  </td>

                  {/* BPM */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <Gauge className="h-3 w-3 text-slate-400" />
                      <span>{song.bpm}</span>
                    </div>
                  </td>

                  {/* TONALITÉ */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono font-bold text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {song.key}
                    </span>
                  </td>

                  {/* ACCORDAGE */}
                  <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400">
                    {song.tuning}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      className="inline-flex p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE D'AJOUT */}
      <SongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSong}
      />
    </div>
  );
}
