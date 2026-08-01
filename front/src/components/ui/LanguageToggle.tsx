import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

// 💡 Il suffira d'ajouter tes nouvelles langues ici plus tard !
const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
//   { code: 'es', name: 'Español', flag: '🇪🇸' },
//   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
//   { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Détermine la langue active (par défaut 'fr')
  const currentCode = (i18n.language || 'fr').slice(0, 2);
  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === currentCode) || LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Bouton Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="uppercase tracking-wider">{currentLanguage.code}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu Déroulant (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Langue / Language
          </div>
          
          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}