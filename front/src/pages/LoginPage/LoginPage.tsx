import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  loginSchema,
  type LoginFormData,
} from '../../features/auth/schemas/loginSchema';
import { authService } from '../../features/auth/services/authService';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import logo from '../../assets/logo.png';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Une erreur est survenue',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-100 p-4 transition-colors duration-300 dark:bg-slate-950">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Roadie Logo"
            className="mb-3 h-20 w-20 object-contain transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Roadie
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('login.welcome')}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Input
            label={t('login.input.email')}
            type="email"
            placeholder="you@domain.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={t('login.input.password')}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="pt-1">
            <Checkbox
              label={t('login.input.rememberMe')}
              {...register('rememberMe')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold"
            isLoading={isLoading}
          >
            {t('login.button')}
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('login.noAccount')}{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {t('login.createAccount')}
          </Link>
        </div>
      </div>
    </main>
  );
}
