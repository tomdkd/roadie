import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          className={cn(
            'h-4 w-4 rounded border-slate-300 text-blue-600 transition focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-blue-600',
            className,
          )}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className="cursor-pointer text-sm text-slate-600 dark:text-slate-400 select-none"
        >
          {label}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';