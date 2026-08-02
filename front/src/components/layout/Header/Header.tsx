import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../../ui/LanguageToggle';
import { ThemeToggle } from '../../ui/ThemeToggle';
import {
  Bell,
  Settings,
  ChevronDown,
  User,
  FolderKanban,
  FileText,
  LogOut,
  Menu,
} from 'lucide-react';
import { NewProjectModal } from '../../../features/projects/components/NewProjectModal';
import { ProjectSelector } from '../../../features/projects/components/ProjectSelector';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-3 backdrop-blur-md transition-colors sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
        {/* 📱 Gauche : Bouton Burger (Mobile) + Sélecteur de Projet */}
        <div className="flex items-center gap-2">
          {/* Bouton Menu Burger sur Mobile */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            title="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Sélecteur de Projet */}
          <ProjectSelector
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          />
        </div>

        {/* 📱 Droite : Actions & Profil */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 sm:p-2 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {/* ⚙️ Paramètres */}
          <Link
            to="/settings"
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 sm:p-2 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Paramètres"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <div className="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* Langue & Thème */}
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* User Profile */}
          <div ref={userMenuRef} className="relative z-50">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                JH
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs leading-tight font-bold text-slate-900 dark:text-white">
                  Jimi Hendrix
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Guitare / Leader
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Profil */}
            {isUserMenuOpen && (
              <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md transition-all duration-100 dark:border-slate-800 dark:bg-slate-900/95">
                <div className="border-b border-slate-100 px-3 py-2 md:hidden dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Jimi Hendrix
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Guitare / Leader
                  </p>
                </div>

                {/* Toggles Langue & Thème intégrés dans le menu sur Mobile */}
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 sm:hidden dark:border-slate-800">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>

                <div className="space-y-0.5 py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Mon profil
                  </Link>

                  <Link
                    to="/my-project"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FolderKanban className="h-4 w-4 text-slate-400" />
                    Mon projet
                  </Link>

                  <Link
                    to="/my-info"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FileText className="h-4 w-4 text-slate-400" />
                    Mes informations
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </>
  );
}
