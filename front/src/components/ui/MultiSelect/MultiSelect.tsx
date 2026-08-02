import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Sélectionner...',
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle de sélection d'une option sans fermer le menu
  const handleToggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemoveBadge = (e: React.MouseEvent, optionToRemove: string) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== optionToRemove));
  };

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
    <div ref={containerRef} className="space-y-1 text-left relative">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {/* Zone Input principale */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white p-2 text-sm transition focus-within:ring-2 dark:bg-slate-900 cursor-pointer pr-9 ${
          error
            ? 'border-red-500 focus-within:ring-red-500/20'
            : 'border-slate-300 focus-within:border-blue-500 focus-within:ring-blue-500/20 dark:border-slate-700'
        }`}
      >
        {selected.length === 0 && (
          <span className="text-slate-400 dark:text-slate-500 text-xs pl-1 select-none">
            {placeholder}
          </span>
        )}

        {/* Badges des genres ajoutés */}
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-in fade-in zoom-in-95 duration-100"
          >
            {item}
            <button
              type="button"
              onClick={(e) => handleRemoveBadge(e, item)}
              className="rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <ChevronDown
          className={`absolute right-3 top-[34px] h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Menu déroulant (Garde l'état ouvert au clic) */}
      {isOpen && (
        <div className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggleOption(option)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}