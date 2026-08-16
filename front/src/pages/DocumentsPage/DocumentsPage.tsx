import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  ChevronDown,
  UploadCloud,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Switch } from '../../components/ui/Switch';
import type { ToastMessage } from '../../components/ui/Toast';
import { CreateEpkModal } from './modals/CreateEpkModal';
import { CreateTechRiderModal } from './modals/CreateTechRiderModal';
import { UploadDocumentModal } from './modals/UploadDocumentModal';
import { DocumentListItem } from './components/DocumentListItem';
import { DocumentsProvider, type GroupDocument, type DocumentFormat } from './providers/DocumentsProvider';
export type { GroupDocument, DocumentFormat, DocumentType, DocumentVersion } from './providers/DocumentsProvider';

const FORMAT_OPTIONS: { id: DocumentFormat; label: string }[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'docx', label: 'DOCX' },
  { id: 'xlsx', label: 'XLSX' },
  { id: 'csv', label: 'CSV' },
];

export function DocumentsPage() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<GroupDocument[]>([]);
  const [search, setSearch] = useState('');

  const TYPE_OPTIONS = useMemo(
    () => [
      { id: 'rider', label: t('documentsPage.types.rider') },
      { id: 'epk', label: t('documentsPage.types.epk') },
      { id: 'document', label: t('documentsPage.types.document') },
    ],
    [t]
  );

  useEffect(() => {
    DocumentsProvider.getDocuments().then(setDocuments);
  }, []);

  // Multiselect states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<DocumentFormat[]>([]);

  // Popovers & Modals
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isFormatFilterOpen, setIsFormatFilterOpen] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isEpkModalOpen, setIsEpkModalOpen] = useState(false);
  const [isTechRiderModalOpen, setIsTechRiderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const typeFilterRef = useRef<HTMLDivElement | null>(null);
  const formatFilterRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
        setIsTypeFilterOpen(false);
      }
      if (formatFilterRef.current && !formatFilterRef.current.contains(event.target as Node)) {
        setIsFormatFilterOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    setToast({ id: crypto.randomUUID(), message, type });
  };

  const toggleTypeFilter = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const toggleFormatFilter = (formatId: DocumentFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId) ? prev.filter((f) => f !== formatId) : [...prev, formatId]
    );
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());

      let matchesType = true;
      if (selectedTypes.length > 0) {
        const isRider =
          selectedTypes.includes('rider') &&
          (doc.type === 'tech_rider' || doc.type === 'hospitality_rider');
        const isEpk = selectedTypes.includes('epk') && doc.type === 'epk';
        const isDoc = selectedTypes.includes('document') && doc.type === 'other';
        matchesType = isRider || isEpk || isDoc;
      }

      let matchesFormat = true;
      if (selectedFormats.length > 0) {
        matchesFormat = selectedFormats.includes(doc.format);
      }

      return matchesSearch && matchesType && matchesFormat;
    });
  }, [documents, search, selectedTypes, selectedFormats]);

  const handleDeleteDocument = (doc: GroupDocument) => {
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    setActiveMenuId(null);
    showToast(t('documentsPage.toast.deleted', { name: doc.name }), 'success');
  };

  const handlePreviewDocument = (doc: GroupDocument) => {
    showToast(t('documentsPage.toast.preview', { name: doc.name }), 'info');
  };

  const handleDownloadDocument = (doc: GroupDocument) => {
    showToast(t('documentsPage.toast.download', { name: doc.name, format: doc.format }), 'success');
  };

  const handleUploadDocumentSubmit = (file: File) => {
    setIsUploadModalOpen(false);

    const ext = file.name.split('.').pop()?.toLowerCase() as DocumentFormat;
    const format: DocumentFormat = ['pdf', 'docx', 'xlsx', 'csv'].includes(ext) ? ext : 'pdf';

    const newDoc: GroupDocument = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: 'other',
      format,
      createdAt: new Date().toISOString().split('T')[0],
      history: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString().split('T')[0],
          author: 'Jimi Hendrix',
        },
      ],
    };

    setDocuments((prev) => [newDoc, ...prev]);
    showToast(t('documentsPage.toast.uploaded', { name: file.name }), 'success');
  };

  const handleEpkModalStart = () => {
    setIsEpkModalOpen(false);
    showToast(t('documentsPage.toast.epkPage'), 'info');
  };

  const handleTechRiderModalStart = () => {
    setIsTechRiderModalOpen(false);
    showToast(t('documentsPage.toast.techRiderPage'), 'info');
  };

  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-hidden pr-1">
      {/* EN-TÊTE PAGE ET BOUTONS D'ACTION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
            <FileText className="h-6 w-6 text-blue-500" />
            <span>{t('documentsPage.header.title')}</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {t('documentsPage.header.description')}
          </p>
        </div>

        {/* Boutons adaptatifs sur mobile (w-full) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            <UploadCloud className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{t('documentsPage.actions.upload')}</span>
          </Button>

          <Button
            onClick={() => setIsEpkModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{t('documentsPage.actions.createEpk')}</span>
          </Button>

          <Button
            onClick={() => setIsTechRiderModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>{t('documentsPage.actions.createTechRider')}</span>
          </Button>
        </div>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES MULTISELECT */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('documentsPage.search.placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-slate-50 pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        {/* BOUTONS DES FILTRES POPUP */}
        <div className="flex items-center gap-2">
          {/* FILTRE TYPE */}
          <div className="relative" ref={typeFilterRef}>
            <button
              type="button"
              onClick={() => {
                setIsTypeFilterOpen(!isTypeFilterOpen);
                setIsFormatFilterOpen(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedTypes.length > 0
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t('documentsPage.filters.type')}</span>
              {selectedTypes.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {selectedTypes.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* POPUP SWITCHES TYPE */}
            {isTypeFilterOpen && (
              <div className="absolute right-0 top-10 z-30 w-56 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 dark:border-slate-800 px-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">{t('documentsPage.filters.filterByType')}</span>
                  {selectedTypes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTypes([])}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      {t('documentsPage.filters.clear')}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {TYPE_OPTIONS.map((opt) => {
                    const isChecked = selectedTypes.includes(opt.id);
                    return (
                      <Switch
                        key={opt.id}
                        label={opt.label}
                        checked={isChecked}
                        variant="blue"
                        onCheckedChange={() => toggleTypeFilter(opt.id)}
                        className="py-1.5 px-2 border-0 shadow-none hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FILTRE FORMAT */}
          <div className="relative" ref={formatFilterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFormatFilterOpen(!isFormatFilterOpen);
                setIsTypeFilterOpen(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedFormats.length > 0
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t('documentsPage.filters.format')}</span>
              {selectedFormats.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {selectedFormats.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* POPUP SWITCHES FORMAT */}
            {isFormatFilterOpen && (
              <div className="absolute right-0 top-10 z-30 w-56 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 dark:border-slate-800 px-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">{t('documentsPage.filters.filterByFormat')}</span>
                  {selectedFormats.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFormats([])}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      {t('documentsPage.filters.clear')}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {FORMAT_OPTIONS.map((opt) => {
                    const isChecked = selectedFormats.includes(opt.id);
                    return (
                      <Switch
                        key={opt.id}
                        label={opt.label.toUpperCase()}
                        checked={isChecked}
                        variant="indigo"
                        onCheckedChange={() => toggleFormatFilter(opt.id)}
                        className="py-1.5 px-2 border-0 shadow-none hover:bg-slate-100/70 dark:hover:bg-slate-800/60 font-mono"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-800">
            <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              {t('documentsPage.empty.title')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('documentsPage.empty.description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredDocuments.map((doc) => {
              const isMenuOpen = activeMenuId === doc.id;

              return (
                <DocumentListItem
                  key={doc.id}
                  document={doc}
                  isMenuOpen={isMenuOpen}
                  menuRef={menuRef}
                  onToggleMenu={() => setActiveMenuId(isMenuOpen ? null : doc.id)}
                  onCloseMenu={() => setActiveMenuId(null)}
                  onPreview={() => handlePreviewDocument(doc)}
                  onDownload={() => handleDownloadDocument(doc)}
                  onDelete={() => handleDeleteDocument(doc)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* MODALES DE CRÉATION & TÉLÉVERSEMENT */}
      <CreateEpkModal
        isOpen={isEpkModalOpen}
        onClose={() => setIsEpkModalOpen(false)}
        onStart={handleEpkModalStart}
      />

      <CreateTechRiderModal
        isOpen={isTechRiderModalOpen}
        onClose={() => setIsTechRiderModalOpen(false)}
        onStart={handleTechRiderModalStart}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadDocumentSubmit}
      />

      <Toast key={toast?.id} toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
