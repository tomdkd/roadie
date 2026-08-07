import { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  File,
  Plus,
  Trash2,
  MoreVertical,
  Search,
  Sparkles,
  History,
  X,
  Eye,
  User,
  Download,
  ChevronDown,
  UploadCloud,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Switch } from '../../components/ui/Switch';
import type { ToastMessage } from '../../components/ui/Toast';
import { CreateEpkModal } from './modals/CreateEpkModal';
import { CreateTechRiderModal } from './modals/CreateTechRiderModal';
import { UploadDocumentModal } from './modals/UploadDocumentModal';

export type DocumentType = 'tech_rider' | 'epk' | 'hospitality_rider' | 'other';
export type DocumentFormat = 'pdf' | 'docx' | 'xlsx' | 'csv';

export interface DocumentVersion {
  id: string;
  date: string;
  author: string;
}

export interface GroupDocument {
  id: string;
  name: string;
  type: DocumentType;
  format: DocumentFormat;
  createdAt: string;
  history: DocumentVersion[];
}

const INITIAL_DOCUMENTS: GroupDocument[] = [
  {
    id: '1',
    name: 'Fiche Technique Tournée 2026',
    type: 'tech_rider',
    format: 'pdf',
    createdAt: '2026-06-15',
    history: [
      { id: 'v1-3', date: '2026-06-15', author: 'Jimi Hendrix' },
      { id: 'v1-2', date: '2026-04-10', author: 'Dave Grohl' },
      { id: 'v1-1', date: '2026-01-05', author: 'Jimi Hendrix' },
    ],
  },
  {
    id: '2',
    name: 'EPK Presse & Festivités - The Neon Monkeys',
    type: 'epk',
    format: 'pdf',
    createdAt: '2026-07-02',
    history: [{ id: 'v2-1', date: '2026-07-02', author: 'Alex Turner' }],
  },
  {
    id: '3',
    name: 'Rider d\'Accueil & Catering',
    type: 'hospitality_rider',
    format: 'docx',
    createdAt: '2026-05-10',
    history: [
      { id: 'v3-2', date: '2026-05-10', author: 'Paul McCartney' },
      { id: 'v3-1', date: '2026-02-18', author: 'Paul McCartney' },
    ],
  },
  {
    id: '4',
    name: 'Plan de Scène & Patch Line',
    type: 'tech_rider',
    format: 'pdf',
    createdAt: '2026-07-28',
    history: [
      { id: 'v4-2', date: '2026-07-28', author: 'Dave Grohl' },
      { id: 'v4-1', date: '2026-05-14', author: 'Jimi Hendrix' },
    ],
  },
  {
    id: '5',
    name: 'Exports SACEM & Streamings 2026',
    type: 'other',
    format: 'csv',
    createdAt: '2026-08-01',
    history: [{ id: 'v5-1', date: '2026-08-01', author: 'Alex Turner' }],
  },
];

const TYPE_OPTIONS = [
  { id: 'rider', label: 'Rider' },
  { id: 'epk', label: 'EPK' },
  { id: 'document', label: 'Document' },
];

const FORMAT_OPTIONS: { id: DocumentFormat; label: string }[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'docx', label: 'DOCX' },
  { id: 'xlsx', label: 'XLSX' },
  { id: 'csv', label: 'CSV' },
];

export function DocumentsPage() {
  const [documents, setDocuments] = useState<GroupDocument[]>(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState('');

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
    showToast(`Le document "${doc.name}" a été supprimé.`, 'success');
  };

  const handlePreviewDocument = (doc: GroupDocument) => {
    showToast(`Aperçu de "${doc.name}"...`, 'info');
  };

  const handleDownloadDocument = (doc: GroupDocument) => {
    showToast(`Téléchargement de "${doc.name}.${doc.format}"...`, 'success');
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
    showToast(`Le document "${file.name}" a été téléversé avec succès !`, 'success');
  };

  const handleEpkModalStart = () => {
    setIsEpkModalOpen(false);
    showToast('Page de création d\'un EPK', 'info');
  };

  const handleTechRiderModalStart = () => {
    setIsTechRiderModalOpen(false);
    showToast('Page de création de la fiche technique', 'info');
  };

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

  const getTypeBadge = (type: DocumentType) => {
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
  };

  const getFormatBadge = (format: DocumentFormat) => {
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
  };

  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-hidden pr-1">
      {/* EN-TÊTE PAGE ET BOUTONS D'ACTION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
            <FileText className="h-6 w-6 text-blue-500" />
            <span>Documents du groupe</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Référentiel des fiches techniques, EPK et dossiers de presse.
          </p>
        </div>

        {/* Boutons adaptatifs sur mobile (w-full) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            <UploadCloud className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Téléverser</span>
          </Button>

          <Button
            onClick={() => setIsEpkModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Créer un nouvel EPK</span>
          </Button>

          <Button
            onClick={() => setIsTechRiderModalOpen(true)}
            className="w-full sm:w-auto justify-center py-2 px-3 text-xs gap-1.5"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Créer une nouvelle fiche technique</span>
          </Button>
        </div>
      </div>

      {/* BARRE DE RECHERCHE ET FILTRES MULTISELECT */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un document..."
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
              <span>Type</span>
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
                  <span className="text-[11px] font-bold text-slate-400">Filtrer par type</span>
                  {selectedTypes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTypes([])}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      Effacer
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
              <span>Format</span>
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
                  <span className="text-[11px] font-bold text-slate-400">Filtrer par format</span>
                  {selectedFormats.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFormats([])}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      Effacer
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

      {/* SEULE LA LISTE EST SCROLLABLE (flex-1 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-800">
            <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Aucun document trouvé
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Essaye de modifier la recherche ou de réinitialiser les filtres sélectionnés.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredDocuments.map((doc) => {
              const isMenuOpen = activeMenuId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="relative flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
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
                        {getTypeBadge(doc.type)}
                        {getFormatBadge(doc.format)}
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
                      onClick={() => handlePreviewDocument(doc)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Télécharger le document"
                      onClick={() => handleDownloadDocument(doc)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Supprimer le document"
                      onClick={() => handleDeleteDocument(doc)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      aria-label={`Options pour ${doc.name}`}
                      title="Historique des versions & options"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : doc.id)}
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
                          onClick={() => setActiveMenuId(null)}
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