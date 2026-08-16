import type { DocumentFormat } from '../../DocumentsPage';

export interface DocumentFormatBadgeProps {
  format: DocumentFormat;
}

export function DocumentFormatBadge({ format }: DocumentFormatBadgeProps) {
  switch (format) {
    case 'pdf':
      return (
        <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          PDF
        </span>
      );
    case 'docx':
      return (
        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          DOCX
        </span>
      );
    case 'xlsx':
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          XLSX
        </span>
      );
    case 'csv':
      return (
        <span className="inline-flex items-center rounded-md bg-teal-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
          CSV
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600 dark:bg-slate-500/20 dark:text-slate-400">
          {format}
        </span>
      );
  }
}
