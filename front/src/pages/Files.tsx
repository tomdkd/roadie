import { useEffect, useState } from 'react'
import { FileAudio, FileImage, FileText, Folder } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { getFiles } from '../lib/api'

type FolderItem = { title: string; description: string }
type FileItem = { type: string; name: string; size: string; date: string }

const fallbackFolders: FolderItem[] = [
  { title: 'Presskits & HD Photos', description: 'Band assets' },
  { title: 'Demos & Pre-productions', description: 'Audio tracks' },
]

const fallbackFiles: FileItem[] = [
  { type: 'audio', name: 'Youth_Collapse_Track_01_v2.wav', size: '45.2 MB', date: 'Today' },
  { type: 'image', name: 'Band_Promo_Landscape_2026.jpg', size: '8.4 MB', date: '2 days ago' },
  { type: 'text', name: 'Stuck_In_Yesterday_Technical_Rider.pdf', size: '1.2 MB', date: 'May 2026' },
]

function iconForType(type: string) {
  if (type === 'audio') return <FileAudio size={18} color="#2563eb" />
  if (type === 'image') return <FileImage size={18} color="#8b5cf6" />
  return <FileText size={18} color="#f97316" />
}

export default function Files() {
  const [folders, setFolders] = useState<FolderItem[]>(fallbackFolders)
  const [recentFiles, setRecentFiles] = useState<FileItem[]>(fallbackFiles)

  useEffect(() => {
    let mounted = true

    getFiles()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data?.folders)) setFolders(data.folders)
        if (Array.isArray(data?.recentFiles)) setRecentFiles(data.recentFiles)
      })
      .catch(() => {
        if (mounted) {
          setFolders(fallbackFolders)
          setRecentFiles(fallbackFiles)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>Files</h1>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {folders.map((folder) => (
          <div key={folder.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Folder size={20} color="#2563eb" />
            <div>
              <div style={{ fontWeight: 700 }}>{folder.title}</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>{folder.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        {recentFiles.map((file, index) => (
          <div key={file.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottom: index === recentFiles.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {iconForType(file.type)}
              <div>
                <div style={{ fontWeight: 700 }}>{file.name}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{file.size}</div>
              </div>
            </div>
            <div style={{ color: '#94a3b8' }}>{file.date}</div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
