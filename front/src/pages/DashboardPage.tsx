import { useAuthStore } from '../features/auth/store/useAuthStore';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tableau de bord 🎸
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ravi de te revoir, {user?.name} !
          </p>
        </div>
        <Button onClick={logout} variant="outline">
          Se déconnecter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Prochain Concert</h3>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Main Square Festival</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Dans 4 jours</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Setlist Active</h3>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Tournée d'Été 2026</p>
          <p className="text-xs text-slate-400 mt-1">14 morceaux (1h15)</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Membres du Groupe</h3>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">5 Membres</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Tous disponibles</p>
        </div>
      </div>
    </div>
  );
}