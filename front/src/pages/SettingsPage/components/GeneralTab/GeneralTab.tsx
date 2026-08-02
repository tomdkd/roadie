import { useState } from 'react';
import { ChevronDown, Upload, Info } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { MultiSelect } from '../../../../components/ui/MultiSelect/MultiSelect';
import { MusicBrainzModal } from '../../modals/MusicBrainzModal/MusicBrainzModal';

const PROJECT_TYPES = [
  { value: 'band', label: 'Groupe / Band' },
  { value: 'artist', label: 'Artiste solo' },
  { value: 'orchestra', label: 'Orchestre' },
  { value: 'choir', label: 'Chœur / Chorale' },
  { value: 'fanfare', label: 'Fanfare' },
  { value: 'dj', label: 'DJ / Producteur' },
  { value: 'other', label: 'Autre' },
];

const MUSIC_STYLES = [
  'Rock',
  'Pop',
  'Hip-Hop / Rap',
  'Metal',
  'Electronic',
  'Jazz',
  'Blues',
  'Reggae',
  'Funk / Soul',
  'Classical',
  'Folk / Indie',
  'Punk',
];

export function GeneralTab() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Rock',
    'Blues',
    'Funk / Soul',
  ]);
  const [isMbidHelpOpen, setIsMbidHelpOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
      {/* COLONNE GAUCHE (2/3) : IDENTITÉ DU GROUPE & LOGO */}
      <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Identité du groupe
          </h2>

          {/* Nom & Type de projet */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Nom du groupe" defaultValue="The Neon Monkeys" />

            <div className="relative space-y-1 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Type de projet
              </label>
              <div className="relative">
                <select
                  defaultValue="band"
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Pays & Ville */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Pays" defaultValue="France" />
            <Input label="Ville de résidence" defaultValue="Lille" />
          </div>

          {/* Styles musicaux (MultiSelect) */}
          <MultiSelect
            label="Styles de musique"
            options={MUSIC_STYLES}
            selected={selectedStyles}
            onChange={setSelectedStyles}
          />
        </div>

        {/* LOGO / IMAGE DU PROJET */}
        <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Logo du projet
          </label>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-base font-black text-white shadow-sm">
              T
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
              >
                <Upload className="h-3.5 w-3.5" />
                Changer l'image
              </button>
              <span className="text-[10px] text-slate-400">
                PNG, JPG ou SVG (max 2 Mo)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COLONNE DROITE (1/3) : UNITÉS & MUSICBRAINZ & BOUTON */}
      <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          {/* FORMATAGE & UNITÉS */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Formatage & Unités
            </h2>

            <div className="relative space-y-1 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Unités de distance
              </label>
              <div className="relative">
                <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option value="km">Kilomètres (km)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="relative space-y-1 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Devise par défaut
              </label>
              <div className="relative">
                <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option value="EUR">Euros (€)</option>
                  <option value="USD">Dollars ($)</option>
                  <option value="GBP">Livres Sterling (£)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="relative space-y-1 text-left">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Format de date
              </label>
              <div className="relative">
                <select className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3.5 pr-10 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option value="DD/MM/YYYY">JJ/MM/AAAA (31/12/2026)</option>
                  <option value="MM/DD/YYYY">MM/JJ/AAAA (12/31/2026)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* MUSICBRAINZ ID AVEC BOUTON INFO */}
          {/* MUSICBRAINZ ID AVEC BOUTON INFO */}
      <div className="space-y-1 text-left">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Identifiant MusicBrainz (MBID)
          </label>
          <button
            type="button"
            onClick={() => setIsMbidHelpOpen(true)}
            className="flex items-center gap-1 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            title="Qu'est-ce que c'est ?"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
        <Input
          placeholder="Ex: f1234567-89ab-cdef-0123-456789abcdef"
          defaultValue="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          className="font-mono text-xs"
        />
      </div>
        </div>

        {/* BOUTON ENREGISTRER */}
        <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
          <Button className="w-full">Enregistrer les modifications</Button>
        </div>
      </div>

      <MusicBrainzModal
        isOpen={isMbidHelpOpen}
        onClose={() => setIsMbidHelpOpen(false)}
      />
    </div>
  );
}