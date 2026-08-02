import { useState } from 'react';
import { ChevronDown, Check, Clock, Plus } from 'lucide-react';

export interface ProjectOption {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'pending';
  avatar?: string;
}

const MOCK_PROJECTS: ProjectOption[] = [
  {
    id: '1',
    name: 'The Neon Monkeys',
    role: 'Leader / Guitare',
    status: 'active',
  },
  {
    id: '2',
    name: 'Electric Experience',
    role: 'Membre invité',
    status: 'pending', // ⏳ Projet en attente de validation
  },
];

interface ProjectSelectorProps {
  onOpenNewProjectModal: () => void;
}

export function ProjectSelector({
  onOpenNewProjectModal,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectOption>(
    MOCK_PROJECTS[0],
  );

  const handleSelect = (project: ProjectOption) => {
    // Si le projet est en attente, on ne switch pas le dashboard dessus
    if (project.status === 'pending') return;

    setSelectedProject(project);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bouton Principal du Sélecteur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
          {selectedProject.name.charAt(0)}
        </div>
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {selectedProject.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu Déroulant Dropdown */}
      {isOpen && (
        <>
          {/* Overlay invisible pour fermer en cliquant à côté */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl duration-150 dark:border-slate-800 dark:bg-slate-900">
            <div className="px-2 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Mes projets
            </div>

            <div className="space-y-1">
              {MOCK_PROJECTS.map((project) => {
                const isSelected = selectedProject.id === project.id;
                const isPending = project.status === 'pending';

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handleSelect(project)}
                    disabled={isPending}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-colors ${
                      isPending
                        ? 'cursor-not-allowed bg-slate-50/50 opacity-60 dark:bg-slate-800/30'
                        : isSelected
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isPending
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {project.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-xs leading-tight font-bold text-slate-900 dark:text-white">
                          {project.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {isPending ? 'Validation en attente' : project.role}
                        </p>
                      </div>
                    </div>

                    {/* Statut ou Checkmark */}
                    {isPending ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        <Clock className="h-3 w-3 animate-pulse" />
                        En attente
                      </span>
                    ) : (
                      isSelected && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

            {/* Bouton pour ouvrir la modale d'ajout */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenNewProjectModal();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Plus className="h-4 w-4 text-blue-500" />
              <span>Nouveau projet / Rejoindre</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
