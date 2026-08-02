import { useState } from 'react';
import { X, Search, MapPin, Music2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

export interface ProjectResult {
  id: string;
  name: string;
  type: string;
  styles: string[];
  city: string;
  country: string;
  membersCount: number;
}

// Mocks de projets existants pour tester la recherche
const MOCK_PROJECTS: ProjectResult[] = [
  {
    id: 'proj_1',
    name: 'The Neon Monkeys',
    type: 'Groupe de musique',
    styles: ['Rock', 'Indie'],
    city: 'Lille',
    country: 'France',
    membersCount: 4,
  },
  {
    id: 'proj_2',
    name: 'Electric Dreams',
    type: 'DJ / Producteur',
    styles: ['Électro / Synthwave', 'Pop'],
    city: 'Paris',
    country: 'France',
    membersCount: 2,
  },
  {
    id: 'proj_3',
    name: 'Velvet Thunder',
    type: 'Groupe de musique',
    styles: ['Metal', 'Punk'],
    city: 'Lyon',
    country: 'France',
    membersCount: 5,
  },
  {
    id: 'proj_4',
    name: 'Brass Attack',
    type: 'Fanfare / Ensemble',
    styles: ['Funk / Soul', 'Jazz'],
    city: 'Bordeaux',
    country: 'France',
    membersCount: 8,
  },
];

interface SearchProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectResult) => void;
}

export function SearchProjectModal({
  isOpen,
  onClose,
  onSelectProject,
}: SearchProjectModalProps) {
  const [searchName, setSearchName] = useState('');
  const [searchStyle, setSearchStyle] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchCountry, setSearchCountry] = useState('');

  if (!isOpen) return null;

  // Filtrage dynamique selon les saisies
  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchName = project.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchCity = project.city
      .toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchCountry = project.country
      .toLowerCase()
      .includes(searchCountry.toLowerCase());
    const matchStyle =
      searchStyle === '' ||
      project.styles.some((s) =>
        s.toLowerCase().includes(searchStyle.toLowerCase()),
      );

    return matchName && matchCity && matchCountry && matchStyle;
  });

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header du Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Rechercher ton projet sur Roadie
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Trouve ton groupe et demande à rejoindre l'équipe existante.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire de Recherche (Filtres) */}
        <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <Input
            label="Nom du groupe / artiste"
            placeholder="ex: The Neon Monkeys"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            label="Style musical"
            placeholder="ex: Rock, Metal..."
            value={searchStyle}
            onChange={(e) => setSearchStyle(e.target.value)}
          />
          <Input
            label="Ville"
            placeholder="ex: Lille, Paris..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <Input
            label="Pays"
            placeholder="ex: France"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
        </div>

        {/* Liste des Résultats */}
        <div className="my-2 flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredProjects.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              Aucun projet ne correspond à votre recherche.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-blue-500 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-blue-500"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {project.name}
                    </h3>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {project.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {project.city}, {project.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Music2 className="h-3.5 w-3.5 text-slate-400" />
                      {project.styles.join(', ')}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => onSelectProject(project)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  C'est mon projet
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 text-right dark:border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
