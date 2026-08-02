import React from 'react';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  variant?: 'blue' | 'indigo';
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  variant = 'blue',
  disabled,
  className = '',
  ...props
}: SwitchProps) {
  const activeBgClass = variant === 'indigo' ? 'bg-indigo-600' : 'bg-blue-600';

  return (
    <div
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-left shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${className}`}
    >
      {(label || description) && (
        <div className="min-w-0 flex-1 space-y-0.5">
          {label && (
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </p>
          )}
          {description && (
            <p className="truncate text-[10px] text-slate-400">{description}</p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onCheckedChange(!checked);
        }}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? activeBgClass : 'bg-slate-200 dark:bg-slate-700'
        }`}
        {...props}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
