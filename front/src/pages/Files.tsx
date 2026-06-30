import { useEffect, useState } from 'react'
import { FileAudio, FileImage, FileText, Folder, Upload, HardDrive, Filter, Trash2, Search, ArrowUpRight, RefreshCw } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { getFiles } from '../lib/api'
import toast, { Toaster } from 'react-hot-toast'

type FolderItem = { title: string; description: string; count: number }
type FileItem = { type: string; name: string; size: string; date: string }

const fallbackFolders: FolderItem[] = [
  { title: 'Presskits & HD Photos', description: 'Band assets', count: 2 },
  { title: 'Demos & Pre-productions', description: 'Audio tracks', count: 4 },
  { title: 'Live & Backline Riders', description: 'Stage logistics', count: 1 }
]

const fallbackFiles: FileItem[] = [
  { type: 'audio', name: 'Youth_Collapse_Track_01_v2.wav', size: '45.2 MB', date: 'Today' },
  { type: 'image', name: 'Band_Promo_Landscape_2026.jpg', size: '8.4 MB', date: '2 days ago' },
  { type: 'text', name: 'Stuck_In_Yesterday_Technical_Rider.pdf', size: '1.2 MB', date: 'May 2026' },
]

function iconForType(type: string) {
  if (type === 'audio' || type === 'wav' || type === 'mp3') {
    return <FileAudio size={20} style={{ color: '#3b82f6' }} />
  }
  if (type === 'image' || type === 'jpg' || type === 'png') {
    return <FileImage size={20} style={{ color: '#8b5cf6' }} />
  }
  return <FileText size={20} style={{ color: '#f97316' }} />
}

export default function Files() {
  const [folders, setFolders] = useState<FolderItem[]>(fallbackFolders)
  const [recentFiles, setRecentFiles] = useState<FileItem[]>(fallbackFiles)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    let mounted = true

    getFiles()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data?.folders) && data.folders.length > 0) {
          setFolders(data.folders)
        }
        if (Array.isArray(data?.recentFiles)) {
          setRecentFiles(data.recentFiles)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Simuler le téléversement d'un nouveau fichier musical ou PDF
  const handleSimulateUpload = () => {
    setUploading(true)
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Envoi du fichier vers Google Drive/Le Frigo...',
        success: () => {
          setUploading(false)
          // Ajout asynchrone dans l'état local
          const sampleNewFile = {
            type: 'text',
            name: 'Youth_Collapse_Press_Release_v1.pdf',
            size: '2.4 MB',
            date: 'Just now'
          }
          setRecentFiles((prev) => [sampleNewFile, ...prev])
          return 'Fichier téléversé et indexé avec succès !'
        },
        error: "Échec de l'envoi",
      }
    )
  }

  const handleDeleteFile = (fileName: string) => {
    setRecentFiles((prev) => prev.filter((f) => f.name !== fileName))
    toast.success(`Fichier ${fileName.substring(0, 15)}... supprimé`)
  }

  // Filtrer et rechercher
  const filteredFiles = recentFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'audio' && file.type === 'audio') || 
      (filterType === 'image' && file.type === 'image') || 
      (filterType === 'document' && file.type === 'text')
    return matchesSearch && matchesType
  })

  return (
    <AppShell>
      <Toaster position="top-right" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
        
        {/* En-tête de section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>Explorateur Cloud</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Téléversement synchrone et organisation des riders techniques et pistes audio</p>
          </div>
          
          <button
            onClick={handleSimulateUpload}
            disabled={uploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            <Upload size={16} /> Envoyer un fichier
          </button>
        </div>

        {/* Section supérieure : Statistiques de stockage & dossiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px', alignItems: 'start' }}>
          
          {/* Dossiers Virtuels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {folders.map((folder) => (
              <div 
                key={folder.title} 
                style={{ 
                  background: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  padding: '20px', 
                  display: 'flex', 
                  gap: '14px', 
                  alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px' }}>
                  <Folder size={22} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{folder.title}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                    {folder.count || 2} fichiers • {folder.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Widgets de stockage instantané en cours */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HardDrive size={18} style={{ color: '#475569' }} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>Hébergement Actif</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>148.5 Go / 550 Go</div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: '27%', height: '100%', background: '#3b82f6' }}></div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
              Synchronisé avec Google Drive et Le Frigo.
            </div>
          </div>

        </div>

        {/* Moteur de filtres et recherche */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px 14px 0 0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#334155',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: '#64748b' }} />
            <span style={{ fontSize: '13px', color: '#64748b', marginRight: '6px' }}>Filtrer :</span>
            {['all', 'audio', 'image', 'document'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  border: 'none',
                  background: filterType === type ? '#f1f5f9' : 'transparent',
                  color: filterType === type ? '#1e293b' : '#64748b',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'all' ? 'Tous' : type === 'document' ? 'Documents' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des Fichiers Récents filtrés */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 10px auto' }} />
              Recherche des fichiers indexés...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              Aucun fichier ne correspond à tes filtres de recherche.
            </div>
          ) : (
            <div>
              {filteredFiles.map((file, index) => (
                <div 
                  key={file.name} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    borderBottom: index === filteredFiles.length - 1 ? 'none' : '1px solid #f1f5f9',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {iconForType(file.type)}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>{file.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px', display: 'flex', gap: '8px' }}>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Dernière modification : {file.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => toast.success(`Téléchargement de ${file.name}`)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ArrowUpRight size={12} /> Télécharger
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.name)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
