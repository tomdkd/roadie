import { ActiveSetlistsWidget } from '../components/dashboard/ActiveSetlistsWidget';
import { NextShowWidget } from '../components/dashboard/NextShowWidget';
import { PlatformsWidget } from '../components/dashboard/PlatformsWidget';
import { QuickActionsWidget } from '../components/dashboard/QuickActionsWidget';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tableau de bord 🎸
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ravi de te revoir, Jimi !
        </p>
      </div>

      {/* Grille des Widgets */}
      <PlatformsWidget />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Widget Prochain Concert */}
        <NextShowWidget />
        <ActiveSetlistsWidget />
        <QuickActionsWidget />
      </div>
    </div>
  );
}