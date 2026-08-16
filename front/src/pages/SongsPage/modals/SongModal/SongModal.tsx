import { useState } from 'react';
import { X, Music, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export type SongForm = {
  title: string;
  album: string;
  duration: string;
  bpm: string;
  key: string;
  tuning: string;
  status: string;
};

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (songData: SongForm) => void;
}

export function SongModal({ isOpen, onClose, onSave }: SongModalProps) {
  const { t } = useTranslation();
  // Liste des albums pré-enregistrés
  const [albums] = useState<string[]>([
    'Inédit / Hors album',
    'City Lights (2025)',
    'First Demo (2024)',
    'Electric Ladyland (2026)',
  ]);

  const [formData, setFormData] = useState({
    title: '',
    album: 'City Lights (2025)',
    duration: '03:45',
    bpm: '120',
    key: 'Am',
    tuning: 'Standard (E)',
    status: 'ready',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length >= 3) {
      val = `${val.slice(0, 2)}:${val.slice(2)}`;
    }
    setFormData({ ...formData, duration: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Music className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('songsPage.modals.add.title')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('songsPage.modals.add.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulaire Principal */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* LIGNE 1 : TITRE & ALBUM */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label={t('songsPage.modals.add.fields.title')}
              placeholder={t('songsPage.modals.add.fields.titlePlaceholder')}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            {/* ALBUM AVEC DATALIST (LISTE DÉROULANTE + MÊME COMPOSANT INPUT) */}
            <div>
              <Input
                label={t('songsPage.modals.add.fields.album')}
                placeholder={t('songsPage.modals.add.fields.albumPlaceholder')}
                value={formData.album}
                onChange={(e) =>
                  setFormData({ ...formData, album: e.target.value })
                }
                list="albums-list"
              />
              <datalist id="albums-list">
                {albums.map((alb) => (
                  <option key={alb} value={alb} />
                ))}
              </datalist>
            </div>
          </div>

          {/* LIGNE 2 : DURÉE, BPM, TONALITÉ, ACCORDAGE */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              label={t('songsPage.modals.add.fields.duration')}
              placeholder={t('songsPage.modals.add.fields.durationPlaceholder')}
              maxLength={5}
              value={formData.duration}
              onChange={handleDurationChange}
              className="font-mono"
              required
            />

            <Input
              label={t('songsPage.modals.add.fields.bpm')}
              type="number"
              min={30}
              max={300}
              placeholder={t('songsPage.modals.add.fields.bpmPlaceholder')}
              value={formData.bpm}
              onChange={(e) =>
                setFormData({ ...formData, bpm: e.target.value })
              }
              className="font-mono"
              required
            />

            <Input
              label={t('songsPage.modals.add.fields.key')}
              placeholder={t('songsPage.modals.add.fields.keyPlaceholder')}
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
            />

            <Input
              label={t('songsPage.modals.add.fields.tuning')}
              placeholder={t('songsPage.modals.add.fields.tuningPlaceholder')}
              value={formData.tuning}
              onChange={(e) =>
                setFormData({ ...formData, tuning: e.target.value })
              }
            />
          </div>

          {/* LIGNE 3 : STATUT */}
          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('songsPage.modals.add.fields.status')}
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="ready">{t('songsPage.status.ready')}</option>
                <option value="rehearsal">{t('songsPage.status.rehearsal')}</option>
                <option value="draft">{t('songsPage.status.draft')}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="py-1.5 text-xs"
            >
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" className="py-1.5 text-xs">
              {t('songsPage.modals.add.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}