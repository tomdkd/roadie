import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  ListMusic,
  Users,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X,
} from 'lucide-react';
import logo from '../../assets/logo.png';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', labelKey: 'nav.dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
    { to: '/events', labelKey: 'nav.events', defaultLabel: 'Events', icon: Calendar },
    { to: '/setlists', labelKey: 'nav.setlists', defaultLabel: 'Setlists', icon: ListMusic },
    { to: '/members', labelKey: 'nav.members', defaultLabel: 'Members', icon: Users },
  ];

  return (
    <>
      {/* 📱 Overlay Mobile (Fond sombre au clic pour fermer) */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* 🟢 Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-auto ${
          // Gestion Responsive : Slide-in sur Mobile / Normal sur Desktop
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop Collapsed vs Expanded
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        {/* Header Sidebar (Logo + Toggles) */}
        <div
          className={`flex h-16 items-center border-b border-slate-100 px-3 dark:border-slate-800 ${
            isCollapsed ? 'lg:justify-center' : 'justify-between'
          }`}
        >
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden"
          >
            <img src={logo} alt="Roadie" className="h-8 w-8 shrink-0 object-contain" />
            <span
              className={`text-base font-bold text-slate-900 dark:text-white transition-opacity ${
                isCollapsed ? 'lg:hidden' : 'block'
              }`}
            >
              Roadie
            </span>
          </Link>

          {/* Bouton Fermer sur Mobile */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Bouton Replier sur Desktop */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:block"
              title="Replier"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Bouton Déplier en mode Desktop Replié */}
        {isCollapsed && (
          <div className="hidden justify-center py-2 border-b border-slate-100 dark:border-slate-800 lg:flex">
            <button
              onClick={() => setIsCollapsed(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Déplier"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation principale */}
        <nav className="flex-1 space-y-1.5 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-xs font-semibold transition-colors ${
                    isCollapsed
                      ? 'lg:h-10 lg:w-10 lg:justify-center lg:mx-auto px-3 py-2.5 gap-3'
                      : 'px-3 py-2.5 gap-3'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
                  }`
                }
                title={isCollapsed ? t(item.labelKey, item.defaultLabel) : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={isCollapsed ? 'lg:hidden truncate' : 'truncate'}>
                  {t(item.labelKey, item.defaultLabel)}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar : Aide */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/help"
            onClick={onCloseMobile}
            className={`flex items-center rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-colors ${
              isCollapsed
                ? 'lg:h-10 lg:w-10 lg:justify-center lg:mx-auto px-3 py-2.5 gap-3'
                : 'px-3 py-2.5 gap-3'
            }`}
            title={isCollapsed ? t('nav.help', 'Aide') : undefined}
          >
            <HelpCircle className="h-5 w-5 shrink-0 text-slate-400" />
            <span className={isCollapsed ? 'lg:hidden' : ''}>{t('nav.help', 'Aide')}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}