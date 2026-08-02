import { PlatformsWidget } from '../../features/dashboard/components/PlatformsWidget';
import { NextShowWidget } from '../../features/dashboard/components/NextShowWidget';
import { ActiveSetlistsWidget } from '../../features/dashboard/components/ActiveSetlistsWidget';
import { QuickActionsWidget } from '../../features/dashboard/components/QuickActionsWidget';

export function DashboardPage() {
  return (
    <div className="flex flex-col space-y-4 pb-6 lg:space-y-6">
      {/* Entête avec salutation */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
          Tableau de bord 🎸
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Ravi de te revoir, Jimi !
        </p>
      </div>

      {/* Widget 1 : Audiences (Prend 100% de la largeur) */}
      <PlatformsWidget />

      {/* Widgets 2, 3, 4 : Grille responsive (1 col mobile, 3 cols desktop) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <NextShowWidget />
        <ActiveSetlistsWidget />
        <QuickActionsWidget />
      </div>
    </div>
  );
}
