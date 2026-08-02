import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, PlusCircle, ArrowRight, Music2, CheckCircle2, Clock } from 'lucide-react';
import { CreateProjectForm } from './CreateProjectForm';
import { SearchProjectModal, type ProjectResult } from './SearchProjectModal';
import type { RegisterStep3FormData } from '../../auth/schemas/registerSchema';
import { Button } from '../../../components/ui/Button';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  // Gestion des étapes : 'selection' | 'search' | 'create' | 'created-success' | 'search-pending'
  const [step, setStep] = useState<
    'selection' | 'search' | 'create' | 'created-success' | 'search-pending'
  >('selection');

  const [createdProjectName, setCreatedProjectName] = useState('');
  const [joinedProjectName, setJoinedProjectName] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('selection');
    onClose();
  };

  const handleCreateSubmit = (data: RegisterStep3FormData) => {
    setCreatedProjectName(data.projectName);
    // TODO: Appel API pour créer le projet en base
    setStep('created-success');
  };

  const handleSelectExistingProject = (project: ProjectResult) => {
    setJoinedProjectName(project.name);
    // TODO: Appel API pour envoyer la demande d'adhésion aux admins
    setStep('search-pending');
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Conteneur Modale */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bouton Fermer */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ÉTAPE 1 : SÉLECTION */}
        {step === 'selection' && (
          <div>
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Music2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Ajouter un projet
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Rejoins un groupe existant ou crée un tout nouvel espace pour votre formation musicale.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep('search')}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50/30 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Rechercher un projet
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Rejoins un groupe déjà existant sur Roadie à l'aide d'un nom ou d'un code d'invitation.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  <span>Rechercher</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStep('create')}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Créer un nouveau projet
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Lance l'espace dédié de ton nouveau groupe, duo ou projet solo de A à Z.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                  <span>Nouveau projet</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2A : RECHERCHER */}
        {step === 'search' && (
          <div>
            <button
              onClick={() => setStep('selection')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-4 inline-block transition-colors"
            >
              ← Retour au choix
            </button>
            <SearchProjectModal
              isOpen={true}
              onClose={() => setStep('selection')}
              onSelectProject={handleSelectExistingProject}
            />
          </div>
        )}

        {/* ÉTAPE 2B : CRÉER */}
        {step === 'create' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setStep('selection')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-2 inline-block transition-colors"
              >
                ← Retour au choix
              </button>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Créer un nouveau projet
              </h2>
            </div>

            <CreateProjectForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setStep('selection')}
              submitButtonLabel="Créer le projet"
            />
          </div>
        )}

        {/* ÉTAPE 3A : CONFIRMATION - PROJET CRÉÉ 🎉 */}
        {step === 'created-success' && (
          <div className="py-4 text-center space-y-5 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Projet créé avec succès !
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Le groupe <strong className="text-slate-900 dark:text-white">{createdProjectName}</strong> est désormais prêt. Tu peux dès maintenant y ajouter des membres, gérer tes dates et créer tes setlists.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-left dark:border-emerald-900/50 dark:bg-emerald-950/20 text-xs">
              <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                Conseil pour démarrer 💡
              </p>
              <p className="mt-1 text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                Rends-toi dans la section <strong>Members</strong> pour partager le code d'invitation à tes musiciens et techniciens.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full py-2.5 font-semibold rounded-xl">
              Accéder au tableau de bord
            </Button>
          </div>
        )}

        {/* ÉTAPE 3B : CONFIRMATION - DEMANDE EN ATTENTE DE VALIDATION ⏳ */}
        {step === 'search-pending' && (
          <div className="py-4 text-center space-y-5 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Demande envoyée !
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ta demande de jonction au projet <strong className="text-slate-900 dark:text-white">{joinedProjectName}</strong> a bien été transmise aux administrateurs du groupe.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-left dark:border-amber-900/50 dark:bg-amber-950/20 text-xs">
              <p className="font-semibold text-amber-900 dark:text-amber-300">
                Prochaine étape ⏳
              </p>
              <p className="mt-1 text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                Dès qu'un administrateur valide ta demande, ce projet apparaîtra automatiquement dans ta liste de projets.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full py-2.5 font-semibold rounded-xl">
              Fermer
            </Button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}