import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stepper } from '../../components/ui/Stepper/Stepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  SearchProjectModal,
  type ProjectResult,
} from '../../features/projects/components/SearchProjectModal/SearchProjectModal';
import {
  registerStep2Schema,
  registerStep3Schema,
  type RegisterStep2FormData,
  type RegisterStep3FormData,
} from '../../features/auth/schemas/registerSchema';
import logo from '../../assets/logo.png';
import { Camera, User as UserIcon, Link2, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import { Trans } from 'react-i18next';
import { CreateProjectForm } from '../../features/projects/components/CreateProjectForm';

const STEPS = [
  { id: 1, label: 'register.step1.mainTitle' },
  { id: 2, label: 'register.step2.mainTitle' },
  { id: 3, label: 'register.step3.mainTitle' },
  { id: 4, label: 'register.step4.mainTitle' },
];

type AccountType = 'musician' | 'booker' | 'label';

interface AccountOption {
  id: AccountType;
  title: string;
  description: string;
  icon: string;
}

const ACCOUNT_TYPES: AccountOption[] = [
  {
    id: 'musician',
    title: 'register.step1.musician.title',
    description: 'register.step1.musician.description',
    icon: '🎸',
  },
  {
    id: 'booker',
    title: 'register.step1.booker.title',
    description: 'register.step1.booker.description',
    icon: '🎟️',
  },
  {
    id: 'label',
    title: 'register.step1.label.title',
    description: 'register.step1.label.description',
    icon: '🏢',
  },
];

export function RegisterPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRole] = useState<
    'musician' | 'booker' | 'label'
  >('musician');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedExistingProject, setSelectedExistingProject] =
    useState<ProjectResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulaire Étape 2 (Profil)
  const formStep2 = useForm<RegisterStep2FormData>({
    resolver: zodResolver(registerStep2Schema),
  });
  const formStep3 = useForm<RegisterStep3FormData>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: {
      projectName: '',
      projectType: 'band',
      country: 'France',
      city: '',
      styles: [],
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSelectExistingProject = (project: ProjectResult) => {
    setSelectedExistingProject(project);
    setIsSearchModalOpen(false);

    // Auto-remplissage des champs
    formStep3.setValue('projectName', project.name);
    formStep3.setValue('projectType', project.type);
    formStep3.setValue('city', project.city);
    formStep3.setValue('country', project.country);
    formStep3.setValue('styles', project.styles);

    // 🚀 BYPASS : On saute directement à l'étape 4 !
    setCurrentStep(4);
  };

  const handleCreateNewProjectSubmit = (_data: RegisterStep3FormData) => {
    setSelectedExistingProject(null);
    setCurrentStep(4);
  };

  const onSubmitStep2: SubmitHandler<RegisterStep2FormData> = () => {
    setCurrentStep(3);
  };

  const fillStep2MockData = () => {
    formStep2.setValue('firstName', 'Jimi');
    formStep2.setValue('lastName', 'Hendrix');
    formStep2.setValue(
      'email',
      `jimi.${Math.floor(Math.random() * 1000)}@roadie.test`,
    );
    formStep2.setValue('phone', '06 12 34 56 78');
    formStep2.setValue('city', 'Lille');
    formStep2.setValue('password', 'Password123!');
    formStep2.setValue('confirmPassword', 'Password123!');
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between bg-slate-100 p-6 transition-colors duration-300 dark:bg-slate-950">
      {/* Header */}
      <div className="flex w-full max-w-5xl items-center justify-between">
        <Link to="/login" className="flex items-center gap-3">
          <img src={logo} alt="Roadie" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Roadie
          </span>
        </Link>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full max-w-4xl space-y-8 py-8">
        <Stepper steps={STEPS} currentStep={currentStep} />

        {/* ÉTAPE 1 : Type de compte (avec les tuiles) */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {t('register.step1.title')}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t('register.step1.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {ACCOUNT_TYPES.map((type) => {
                const isSelected = selectedRole === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedRole(type.id)}
                    className={`group relative flex flex-col items-center justify-between rounded-3xl border-2 p-6 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-4 ring-blue-500/10 dark:border-blue-500 dark:bg-slate-900 dark:ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950/50">
                        {type.icon}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t(type.title)}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {t(type.description)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full rounded-xl px-6 py-3 font-semibold sm:w-auto"
                >
                  {t('register.backToHome')}
                </Button>
              </Link>
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedRole}
                className="w-full min-w-[160px] rounded-xl px-8 py-3 font-semibold sm:w-auto"
              >
                {t('next')}
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Parle-nous de toi */}
        {currentStep === 2 && (
          <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xl transition-colors duration-300 sm:p-10 dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t('register.step2.title')}
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('register.step2.description')}
                </p>
              </div>

              {/* 🧪 Bouton DEV pour préremplir */}
              <button
                type="button"
                onClick={fillStep2MockData}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900/60"
                title="Remplir avec de fausses données pour les tests"
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>Dev fill</span>
              </button>
            </div>

            <form
              onSubmit={formStep2.handleSubmit(onSubmitStep2)}
              className="space-y-6"
              noValidate
            >
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-slate-400 transition-transform group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </button>
                <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {t('register.step2.addAvatar')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={t('firstname') + ' *'}
                  placeholder="John"
                  error={formStep2.formState.errors.firstName?.message ? t(formStep2.formState.errors.firstName.message) : undefined}
                  {...formStep2.register('firstName')}
                />
                <Input
                  label={t('lastname') + ' *'}
                  placeholder="Dupont"
                  error={formStep2.formState.errors.lastName?.message ? t(formStep2.formState.errors.lastName.message) : undefined}
                  {...formStep2.register('lastName')}
                />
                <Input
                  label={t('email') + ' *'}
                  type="email"
                  placeholder="johndoe@example.fr"
                  error={formStep2.formState.errors.email?.message ? t(formStep2.formState.errors.email.message) : undefined}
                  {...formStep2.register('email')}
                />
                <Input
                  label={t('phone')}
                  placeholder="06 12 34 56 78"
                  error={formStep2.formState.errors.phone?.message ? t(formStep2.formState.errors.phone.message) : undefined}
                  {...formStep2.register('phone')}
                />
                <div className="sm:col-span-2">
                  <Input
                    label={t('city') + ' *'}
                    placeholder="Paris, Lyon, Lille..."
                    error={formStep2.formState.errors.city?.message ? t(formStep2.formState.errors.city.message) : undefined}
                    {...formStep2.register('city')}
                  />
                </div>
                <Input
                  label={t('password') + ' *'}
                  type="password"
                  placeholder="••••••••"
                  error={formStep2.formState.errors.password?.message ? t(formStep2.formState.errors.password.message) : undefined}
                  {...formStep2.register('password')}
                />
                <Input
                  label={t('confirmPassword') + ' *'}
                  type="password"
                  placeholder="••••••••"
                  error={formStep2.formState.errors.confirmPassword?.message ? t(formStep2.formState.errors.confirmPassword.message) : undefined}
                  {...formStep2.register('confirmPassword')}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-xl px-6 py-2.5 font-medium"
                >
                  {t('previous')}
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl px-8 py-2.5 font-semibold"
                >
                  {t('next')}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ÉTAPE 3 : Projet */}
        {currentStep === 3 && (
          <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xl transition-colors duration-300 sm:p-10 dark:border-slate-800/80 dark:bg-slate-900">
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('register.step3.title')}
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('register.step3.description')}
              </p>
            </div>

            {/* Formulaire extrait */}
            <CreateProjectForm
              onSubmit={handleCreateNewProjectSubmit}
              onCancel={() => setCurrentStep(2)}
            />

            {/* Option supplémentaire : Chercher un projet existant */}
            <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 p-3 text-xs font-medium text-slate-600 transition-colors hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
              >
                <Link2 className="h-4 w-4 text-slate-400 transition-transform group-hover:rotate-45 group-hover:text-blue-500" />
                {t('register.step3.projectExists')}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Confirmation dynamique */}
        {currentStep === 4 && (
          <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xl transition-colors duration-300 sm:p-10 dark:border-slate-800/80 dark:bg-slate-900">
            {selectedExistingProject ? (
              /* CAS B : Rejoindre un projet existant */
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  ⏳
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t('register.step4.waiting.title')}
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <Trans
                      i18nKey="register.step4.waiting.successMessage"
                      values={{ email: formStep2.getValues('email') }}
                      components={[
                        <strong
                          key="email"
                          className="text-slate-700 dark:text-slate-200"
                        />,
                      ]}
                    />
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-left dark:border-amber-900/50 dark:bg-amber-950/20">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                    {t('register.step4.waiting.waitingTitle')}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-800/80 dark:text-amber-400/80">
                    <Trans
                      i18nKey="register.step4.waiting.waitingMessage"
                      values={{ projectName: selectedExistingProject.name }}
                      components={[
                        <strong
                          key="projectName"
                          className="font-bold text-amber-900 dark:text-amber-200"
                        />,
                      ]}
                    />
                  </p>
                </div>

                <Link to="/login" className="block pt-2">
                  <Button className="w-full rounded-xl py-2.5 font-semibold">
                    {t('register.step4.waiting.finish')}
                  </Button>
                </Link>
              </>
            ) : (
              /* CAS A : Création d'un nouveau projet */
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  🎉
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t('register.step4.success.title')}
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <Trans
                      i18nKey="register.step4.success.description"
                      values={{
                        projectName: formStep3.getValues('projectName'),
                      }}
                      components={[
                        <strong
                          key="projectName"
                          className="font-bold text-emerald-900 dark:text-emerald-200"
                        />,
                      ]}
                    />
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-left dark:border-emerald-900/50 dark:bg-emerald-950/20">
                  <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    {t('register.step4.success.information.title')}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-emerald-800/80 dark:text-emerald-400/80">
                    {t('register.step4.success.information.description')}
                  </p>
                </div>

                <Link to="/login" className="block pt-2">
                  <Button className="w-full rounded-xl py-2.5 font-semibold">
                    {t('register.step4.success.finish')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Modal de recherche */}
        <SearchProjectModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSelectProject={handleSelectExistingProject}
        />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        {t('register.alreadyHaveAccount')}{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          {t('login.button')}
        </Link>
      </div>
    </main>
  );
}
