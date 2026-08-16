import type { DocumentType } from '../../DocumentsPage';

export interface DocumentTypeBadgeProps {
  type: DocumentType;
}

export function DocumentTypeBadge({ type }: DocumentTypeBadgeProps) {
  switch (type) {
    case 'tech_rider':
      return (
        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          Fiche technique
        </span>
      );
    case 'epk':
      return (
        <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
          EPK
        </span>
      );
    case 'hospitality_rider':
      return (
        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
          Rider d'accueil
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-500/20 dark:text-slate-400">
          Document
        </span>
      );
  }
}
