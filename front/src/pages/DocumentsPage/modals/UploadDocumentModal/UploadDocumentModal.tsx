import { useState, useRef } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setError(null);

    // Vérification de la taille (Max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      setError('La taille du fichier dépasse la limite autorisée de 2 Mo.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      setError(null);
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* En-tête Modale */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Téléverser un document
            </h2>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Importez un fichier existant depuis votre appareil
            </p>
          </div>
        </div>

        {/* Zone de Drag & Drop / Sélection */}
        <div className="mt-5 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.csv"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : selectedFile
                ? 'border-emerald-500/60 bg-emerald-50/20 dark:border-emerald-500/40 dark:bg-emerald-950/10'
                : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600'
            }`}
          >
            {selectedFile ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-8 w-8 text-emerald-500 shrink-0" />
                  <div className="text-left min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Glissez-déposez votre fichier ici, ou{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 underline">
                    parcourez
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Pas plus de 2 Mo par fichier (PDF, DOCX, XLSX, CSV)
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Pied de Modale */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={handleModalClose}
            className="text-xs py-2 px-3"
          >
            Annuler
          </Button>

          <Button
            type="button"
            disabled={!selectedFile}
            onClick={handleSubmit}
            className="py-2 px-4 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white border-none font-bold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Importer le document</span>
          </Button>
        </div>
      </div>
    </div>
  );
}