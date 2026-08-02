import { PlatformsWidget } from '../../features/dashboard/components/PlatformsWidget';
import { NextShowWidget } from '../../features/dashboard/components/NextShowWidget';
import { ActiveSetlistsWidget } from '../../features/dashboard/components/ActiveSetlistsWidget';
import { QuickActionsWidget } from '../../features/dashboard/components/QuickActionsWidget';

export function DashboardPage() {
  return (
    /* 
      1. overflow-y-auto : Permet le scroll sur mobile/tablette.
      2. lg:overflow-hidden : Sur grand écran, conserve le comportement fixe sans scroll.
      3. pr-1 : Petite marge pour éviter que la scrollbar ne colle au bord sur mobile.
    */
    <div className="flex h-full flex-col justify-start space-y-3 overflow-y-auto pr-1 lg:justify-between lg:space-y-4 lg:overflow-hidden">
      {/* Entête compacte */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-lg font-black text-slate-900 sm:text-xl dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ravi de te revoir, Jimi !
        </p>
      </div>

      {/* Widget 1 : Audiences */}
      <div className="shrink-0">
        <PlatformsWidget />
      </div>

      {/* Widgets 2, 3, 4 */}
      <div className="grid grid-cols-1 gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:gap-4">
        <NextShowWidget />
        <ActiveSetlistsWidget />
        <QuickActionsWidget />
      </div>
    </div>
  );
}