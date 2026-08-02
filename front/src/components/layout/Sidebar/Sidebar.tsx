import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  ListMusic,
  Users,
  MessageSquare,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bug,
  Sparkles,
  X,
  Music,
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import { UpgradeModal } from '../../../features/subscriptions/components/UpgradeModal';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const navItems = [
    {
      to: '/dashboard',
      labelKey: 'nav.dashboard',
      defaultLabel: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/events',
      labelKey: 'nav.events',
      defaultLabel: 'Events',
      icon: Calendar,
    },
    {
      to: '/songs',
      labelKey: 'nav.songs',
      defaultLabel: 'Songs',
      icon: Music,
    },
    {
      to: '/setlists',
      labelKey: 'nav.setlists',
      defaultLabel: 'Setlists',
      icon: ListMusic,
    },
    {
      to: '/members',
      labelKey: 'nav.members',
      defaultLabel: 'Members',
      icon: Users,
    },
    {
      to: '/messages',
      labelKey: 'nav.messages',
      defaultLabel: 'Messages',
      icon: MessageSquare,
    },
    {
      to: '/documents',
      labelKey: 'nav.documents',
      defaultLabel: 'Documents',
      icon: FolderOpen,
    },
  ];

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static lg:z-auto dark:border-slate-800 dark:bg-slate-900 ${
          isOpenMobile
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Header Sidebar (Logo + Toggle) */}
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
            <img
              src={logo}
              alt="Roadie"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span
              className={`text-base font-bold text-slate-900 transition-opacity dark:text-white ${
                isCollapsed ? 'lg:hidden' : 'block'
              }`}
            >
              Roadie
            </span>
          </Link>

          {/* Bouton Fermer sur Mobile */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Bouton Replier sur Desktop */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:block dark:hover:bg-slate-800"
              title="Replier"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Bouton Déplier en mode Desktop Replié */}
        {isCollapsed && (
          <div className="hidden justify-center border-b border-slate-100 py-2 lg:flex dark:border-slate-800">
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
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-2">
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
                      ? 'gap-3 px-3 py-2.5 lg:mx-auto lg:h-10 lg:w-10 lg:justify-center'
                      : 'gap-3 px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
                  }`
                }
                title={
                  isCollapsed ? t(item.labelKey, item.defaultLabel) : undefined
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={isCollapsed ? 'truncate lg:hidden' : 'truncate'}
                >
                  {t(item.labelKey, item.defaultLabel)}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* 🚀 Footer Sidebar : Upgrade + 3 Boutons Icônes + Version */}
        <div className="flex flex-col gap-2.5 border-t border-slate-100 p-3 dark:border-slate-800">
          {/* Bouton Upgrade Pro */}
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile(); // Ferme le menu sur mobile si ouvert
              setIsUpgradeModalOpen(true); // Ouvre la modale
            }}
            className={`group relative flex w-full items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:opacity-95 ${
              isCollapsed ? 'lg:justify-center lg:p-2.5' : 'justify-between'
            }`}
            title={isCollapsed ? 'Passer à la version Pro' : undefined}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <span className={isCollapsed ? 'lg:hidden' : 'block truncate'}>
                Passer en PRO
              </span>
            </div>
            {!isCollapsed && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-sm">
                Offre
              </span>
            )}
          </button>

          {/* Ligne des 3 boutons icônes (Aide, Bug, GitHub) */}
          <div
            className={`flex items-center gap-2 ${isCollapsed ? 'lg:flex-col' : 'justify-center'}`}
          >
            <Link
              to="/help"
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Centre d'aide"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>

            <a
              href="https://github.com/your-repo/roadie/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              title="Signaler un problème"
            >
              <Bug className="h-4 w-4" />
            </a>

            <a
              href="https://github.com/your-repo/roadie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Dépôt GitHub"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* Tag de version */}
          <div className={`text-center ${isCollapsed ? 'lg:hidden' : 'block'}`}>
            <span className="font-mono text-[10px] font-medium text-slate-400 dark:text-slate-600">
              v0.0.1-alpha
            </span>
          </div>
        </div>
      </aside>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
