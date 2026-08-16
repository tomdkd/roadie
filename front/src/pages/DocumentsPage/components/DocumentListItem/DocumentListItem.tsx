import { FileText, FileSpreadsheet, File, Eye, Download, Trash2, MoreVertical, History, X, User } from 'lucide-react';
import type { GroupDocument, DocumentFormat } from '../../DocumentsPage';
import { DocumentTypeBadge } from '../DocumentTypeBadge';
import { DocumentFormatBadge } from '../DocumentFormatBadge';

export interface DocumentListItemProps {
  document: GroupDocument;
  isMenuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function DocumentListItem({
  document: doc,
  isMenuOpen,
  menuRef,
  onToggleMenu,
  onCloseMenu,
  onPreview,
  onDownload,
  onDelete,
}: DocumentListItemProps) {
  const getFormatIcon = (format: DocumentFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-rose-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-teal-500" />;
      default:
        return <File className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Gauche : Icône + Infos */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          {getFormatIcon(doc.format)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xs font-bold text-slate-900 dark:text-white">
              {doc.name}
            </h3>
            <DocumentTypeBadge type={doc.type} />
            <DocumentFormatBadge format={doc.format} />
          </div>

          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Créé le {new Date(doc.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Droite : Actions (Aperçu + Télécharger + Supprimer + Options) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          title="Prévisualiser le document"
          onClick={onPreview}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Eye className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Télécharger le document"
          onClick={onDownload}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Supprimer le document"
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={`Options pour ${doc.name}`}
          title="Historique des versions & options"
          onClick={onToggleMenu}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* POPOVER HISTORIQUE DES VERSIONS */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-3 top-12 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <History className="h-3.5 w-3.5 text-blue-500" />
              <span>Historique des versions</span>
            </div>
            <button
              type="button"
              onClick={onCloseMenu}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {doc.history.map((ver, idx) => (
              <div
                key={ver.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] dark:bg-slate-800/60"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {new Date(ver.date).toLocaleDateString('fr-FR')}
                  </span>
                  {idx === 0 && (
                    <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
                      Actuelle
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 rounded-full bg-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700/60 dark:text-slate-300">
                  <User className="h-3 w-3 text-slate-400" />
                  <span>{ver.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
