import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  Bell,
  Settings,
  ChevronDown,
  User,
  FolderKanban,
  FileText,
  LogOut,
  Plus,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
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
    <header className="flex relative z-30 h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-3 sm:px-6 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/80">
      {/* 📱 Gauche : Bouton Burger (Mobile) + Sélecteur de Projet */}
      <div className="flex items-center gap-2">
        {/* Bouton Menu Burger sur Mobile */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          title="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Sélecteur de Projet */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shrink-0">
            N
          </span>
          {/* Nom masqué sur très petits écrans pour gagner de la place */}
          <span className="max-w-[120px] sm:max-w-none truncate">
            The Neon Monkeys
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>

        {/* ➕ Bouton Ajouter Un Projet */}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 shrink-0"
          title="Ajouter ou rejoindre un projet"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* 📱 Droite : Actions & Profil */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        {/* ⚙️ Paramètres */}
        <Link
          to="/settings"
          className="rounded-full p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Paramètres"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Langue & Thème */}
        <div className="hidden sm:flex items-center gap-2">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm shrink-0">
              JH
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                Jimi Hendrix
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Guitare / Leader</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Profil */}
          {isUserMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 md:hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Jimi Hendrix</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Guitare / Leader</p>
              </div>

              {/* Toggles Langue & Thème intégrés dans le menu sur Mobile */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 sm:hidden">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Mon profil
                </Link>

                <Link
                  to="/my-project"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <FolderKanban className="h-4 w-4 text-slate-400" />
                  Mon projet
                </Link>

                <Link
                  to="/my-info"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileText className="h-4 w-4 text-slate-400" />
                  Mes informations
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
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
  );
}