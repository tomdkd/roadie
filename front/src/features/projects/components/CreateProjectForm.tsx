import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Wand2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  registerStep3Schema,
  type RegisterStep3FormData,
} from '../../auth/schemas/registerSchema';

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

const PROJECT_TYPES = [
  'band',
  'artist',
  'orchestra',
  'choir',
  'fanfare',
  'dj',
  'other',
];

interface CreateProjectFormProps {
  onSubmit: SubmitHandler<RegisterStep3FormData>;
  onCancel?: () => void;
  showCancelButton?: boolean;
  submitButtonLabel?: string;
  showDevFill?: boolean;
}

export function CreateProjectForm({
  onSubmit,
  onCancel,
  showCancelButton = true,
  submitButtonLabel,
  showDevFill = true,
}: CreateProjectFormProps) {
  const { t } = useTranslation();

  const form = useForm<RegisterStep3FormData>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: {
      projectName: '',
      projectType: 'band',
      country: 'France',
      city: '',
      styles: [],
    },
  });

  const fillMockData = () => {
    form.setValue('projectName', 'The Electric Experience');
    form.setValue('projectType', 'band');
    form.setValue('country', 'France');
    form.setValue('city', 'Paris');
    form.setValue('styles', ['Rock', 'Blues', 'Funk / Soul']);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {showDevFill && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={fillMockData}
            className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-100 transition-colors dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 shrink-0"
            title="Remplir avec de fausses données pour les tests"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Dev fill</span>
          </button>
        </div>
      )}

      {/* Nom du projet */}
      <Input
        label={t('projectName')}
        placeholder="Ex: The Neon Monkeys"
        error={t(form.formState.errors.projectName?.message || '')}
        {...form.register('projectName')}
      />

      {/* Type de projet */}
      <div className="space-y-1 text-left relative">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {t('projectType')} *
        </label>
        <div className="relative">
          <select
            {...form.register('projectType')}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer pr-10"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`projectTypes.${type}`)}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Pays & Ville */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('country') + ' *'}
          placeholder="France"
          error={t(form.formState.errors.country?.message || '')}
          {...form.register('country')}
        />
        <Input
          label={t('city') + ' *'}
          placeholder="Lille"
          error={t(form.formState.errors.city?.message || '')}
          {...form.register('city')}
        />
      </div>

      {/* Styles de musique */}
      <Controller
        name="styles"
        control={form.control}
        render={({ field }) => (
          <MultiSelect
            label={t('musicStyles') + ' *'}
            options={MUSIC_STYLES}
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        {showCancelButton && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('previous')}
          </Button>
        )}
        <Button type="submit" className="ml-auto">
          {submitButtonLabel || t('finish')}
        </Button>
      </div>
    </form>
  );
}