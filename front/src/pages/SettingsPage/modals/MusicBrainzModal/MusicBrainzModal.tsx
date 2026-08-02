import { ExternalLink, X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

interface MusicBrainzModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MusicBrainzModal({ isOpen, onClose }: MusicBrainzModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 font-black text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              MB
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Identifiant MusicBrainz (MBID)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenu explicatif mis à jour */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            <strong>MusicBrainz</strong> est l'encyclopédie et la base de données musicale ouverte utilisée par toute l'industrie (plateformes de streaming, lecteurs audio, médias).
          </p>

          <div className="rounded-xl bg-slate-50 p-3 space-y-2 dark:bg-slate-800/50">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Comment Roadie l'utilise pour ton projet :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>
                <strong>Taggage automatique :</strong> Permet à de nombreux outils et lecteurs d'identifier ta musique et de compléter automatiquement les pochette, titres, artistes et métadonnées.
              </li>
              <li>
                <strong>Référencement & Sync :</strong> Roadie récolte tes informations mais en pousse aussi vers MusicBrainz pour optimiser la visibilité de ton groupe.
              </li>
              <li>
                <strong>Mises à jour automatisées :</strong> Roadie vérifie régulièrement que tes données sont à jour et effectue automatiquement les modifications sur MusicBrainz pour maintenir ton profil artiste parfait.
              </li>
            </ul>
          </div>

          <div className="space-y-1 pt-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Comment trouver ton MBID ?
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Recherche ton nom d'artiste sur le site de MusicBrainz, puis copie la clé unique (ex: <code>a1b2c3d4-e5f6...</code>) présente dans l'URL de ta page.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <a
            href="https://musicbrainz.org/search"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            <span>Rechercher sur MusicBrainz</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button onClick={onClose} className="py-1 text-xs">
            J'ai compris
          </Button>
        </div>
      </div>
    </div>
  );
}