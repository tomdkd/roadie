import { useState } from 'react';
import { X, Music, ChevronDown } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (songData: any) => void;
}

export function SongModal({ isOpen, onClose, onSave }: SongModalProps) {
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
                Ajouter une chanson
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enregistre un titre dans le répertoire du groupe.
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
              label="Titre de la chanson"
              placeholder="Ex: Voodoo Child"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            {/* ALBUM AVEC DATALIST (LISTE DÉROULANTE + MÊME COMPOSANT INPUT) */}
            <div>
              <Input
                label="Album / Single"
                placeholder="Sélectionner ou saisir..."
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
              label="Durée (MM:SS)"
              placeholder="03:45"
              maxLength={5}
              value={formData.duration}
              onChange={handleDurationChange}
              className="font-mono"
              required
            />

            <Input
              label="BPM"
              type="number"
              min={30}
              max={300}
              placeholder="120"
              value={formData.bpm}
              onChange={(e) =>
                setFormData({ ...formData, bpm: e.target.value })
              }
              className="font-mono"
              required
            />

            <Input
              label="Tonalité"
              placeholder="Ex: Am"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
            />

            <Input
              label="Accordage"
              placeholder="Ex: Drop D"
              value={formData.tuning}
              onChange={(e) =>
                setFormData({ ...formData, tuning: e.target.value })
              }
            />
          </div>

          {/* LIGNE 3 : STATUT */}
          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Statut
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="ready">Prêt</option>
                <option value="rehearsal">En cours</option>
                <option value="draft">Brouillon</option>
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
              Annuler
            </Button>
            <Button type="submit" className="py-1.5 text-xs">
              Ajouter au répertoire
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}