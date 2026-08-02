import { PlatformsWidget } from '../../features/dashboard/components/PlatformsWidget';
import { NextShowWidget } from '../../features/dashboard/components/NextShowWidget';
import { ActiveSetlistsWidget } from '../../features/dashboard/components/ActiveSetlistsWidget';
import { QuickActionsWidget } from '../../features/dashboard/components/QuickActionsWidget';

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col justify-between space-y-3 lg:space-y-4">
      {/* Entête compacte */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-lg font-black text-slate-900 sm:text-xl dark:text-white">
          Tableau de bord 🎸
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ravi de te revoir, Jimi !
        </p>
      </div>

      {/* Widget 1 : Audiences (Hauteur fixe et compacte) */}
      <div className="shrink-0">
        <PlatformsWidget />
      </div>

      {/* Widgets 2, 3, 4 : S'étirent pour combler exactement le reste de la hauteur */}
      <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4 min-h-0">
        <NextShowWidget />
        <ActiveSetlistsWidget />
        <QuickActionsWidget />
      </div>
    </div>
  );
}