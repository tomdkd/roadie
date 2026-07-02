import { useState, useEffect, type FormEvent } from 'react'
import { AppShell } from '../components/AppShell'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Users, 
  FolderHeart, 
  Plug, 
  Cloud, 
  Sliders, 
  UserPlus, 
  Eye, 
  Pencil, 
  Trash2, 
  X,
  Check,
  RefreshCw
} from 'lucide-react'
import {
  getSettings,
  createSettingsUser,
  updateSettingsUser,
  deleteSettingsUser,
  createProject,
  updateProject,
  deleteProject,
  createMember,
  updateMember,
  deleteMember,
} from '../lib/api'

const tabItems = [
  { label: 'Band & Projects', key: 'profile', icon: FolderHeart },
  { label: 'Users', key: 'users', icon: Users },
  { label: 'Integrations', key: 'integrations', icon: Plug },
  { label: 'Storage', key: 'storage', icon: Cloud },
  { label: 'Preferences', key: 'preferences', icon: Sliders },
]

interface BandMember {
  id: number
  name: string
  role: string
  projectId?: number | null
  projectName?: string | null
}

interface ProjectItem {
  id: number
  value: string
  label: string
  style?: string
  location?: string
  bio?: string
  musicBrainzArtistId?: string
}

interface ProjectFormState {
  name: string
  style: string
  location: string
  bio: string
  musicBrainzArtistId: string
}

const emptyProjectForm: ProjectFormState = {
  name: '',
  style: '',
  location: '',
  bio: '',
  musicBrainzArtistId: '',
}

interface MemberFormState {
  name: string
  role: string
  projectId: number | null
}

const emptyMemberForm: MemberFormState = {
  name: '',
  role: '',
  projectId: null,
}

interface UserAccount {
  id: number
  firstName: string
  lastName: string
  email: string
  project: string
  role: string
  address: string
  phone: string
}

interface UserFormState {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  address: string
}

const emptyUserForm: UserFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
}

const ToggleSwitch = ({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) => (
  <label
    htmlFor={id}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 16px',
      borderRadius: 14,
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      cursor: 'pointer',
    }}
  >
    <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '14px' }}>{label}</span>
    <span
      style={{
        position: 'relative',
        width: 52,
        height: 32,
        borderRadius: 9999,
        backgroundColor: checked ? '#10b981' : '#e2e8f0',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          margin: 0,
          cursor: 'pointer',
          width: '100%',
          height: '100%',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.18)',
          transition: 'left 0.2s ease',
        }}
      />
    </span>
  </label>
)

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modèles de données dynamiques chargés depuis Symfony
  const [project, setProject] = useState('')
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([])
  const [bandMembers, setBandMembers] = useState<BandMember[]>([])
  const [users, setUsers] = useState<UserAccount[]>([])
  
  const [spotifySecret, setSpotifySecret] = useState('')
  const [musicBrainzId, setMusicBrainzId] = useState('')
  const [deezerKey, setDeezerKey] = useState('')
  
  const [theme, setTheme] = useState('system')
  const [notificationSettings, setNotificationSettings] = useState({
    syncFail: true,
    rehearsalReminder: false,
    weeklyDigest: true,
  })

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [activeUserProfile, setActiveUserProfile] = useState<UserAccount | null>(null)

  // Gestion des formulaires d'ajout / d'édition d'utilisateur
  const [userFormMode, setUserFormMode] = useState<'create' | 'edit' | null>(null)
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [submittingUser, setSubmittingUser] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  // Gestion des formulaires projet (groupe)
  const [projectFormMode, setProjectFormMode] = useState<'create' | 'edit' | null>(null)
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [submittingProject, setSubmittingProject] = useState(false)

  // Gestion des formulaires membre (lineup)
  const [memberFormMode, setMemberFormMode] = useState<'create' | 'edit' | null>(null)
  const [memberForm, setMemberForm] = useState<MemberFormState>(emptyMemberForm)
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null)
  const [submittingMember, setSubmittingMember] = useState(false)

  const isAllSelected = selectedUsers.length === users.length && users.length > 0

  // Charger les paramètres depuis l'API Symfony
  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await getSettings()

      if (data.projects) {
        setProjectsList(data.projects)
        setProject((current) => {
          if (current && data.projects.some((p: ProjectItem) => p.value === current)) {
            return current
          }
          return data.projects.length > 0 ? data.projects[0].value : ''
        })
      }
      if (data.members) setBandMembers(data.members)
      if (data.users) setUsers(data.users)

      if (data.integrations) {
        setSpotifySecret(data.integrations.spotifySecret || '')
        setMusicBrainzId(data.integrations.musicBrainzId || '')
        setDeezerKey(data.integrations.deezerKey || '')
      }

      if (data.preferences) {
        if (data.preferences.theme) setTheme(data.preferences.theme)
        if (data.preferences.notificationSettings) {
          setNotificationSettings(data.preferences.notificationSettings)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur réseau lors de la récupération des réglages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    )
  }

  const toggleAllUsers = () => {
    setSelectedUsers((current) => (current.length === users.length ? [] : users.map((u) => u.id)))
  }

  // Ouvre le formulaire en mode création
  const openCreateUser = () => {
    setUserForm(emptyUserForm)
    setEditingUserId(null)
    setUserFormMode('create')
  }

  // Ouvre le formulaire pré-rempli en mode édition
  const openEditUser = (user: UserAccount) => {
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phone: user.phone || '',
      address: user.address || '',
    })
    setEditingUserId(user.id)
    setUserFormMode('edit')
  }

  const closeUserForm = () => {
    setUserFormMode(null)
    setEditingUserId(null)
    setUserForm(emptyUserForm)
  }

  const updateUserFormField = (field: keyof UserFormState, value: string) => {
    setUserForm((current) => ({ ...current, [field]: value }))
  }

  // Soumission du formulaire (création ou mise à jour)
  const handleSubmitUser = async (e: FormEvent) => {
    e.preventDefault()

    if (!userForm.firstName.trim() || !userForm.lastName.trim() || !userForm.email.trim()) {
      toast.error('Prénom, nom et email sont obligatoires')
      return
    }
    if (userFormMode === 'create' && !userForm.password.trim()) {
      toast.error('Un mot de passe initial est requis pour créer un compte')
      return
    }

    setSubmittingUser(true)
    try {
      if (userFormMode === 'create') {
        const data = await createSettingsUser({
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          email: userForm.email.trim(),
          password: userForm.password,
          phone: userForm.phone.trim(),
          address: userForm.address.trim(),
        })
        setUsers((current) => [...current, data.user])
        toast.success('Utilisateur ajouté avec succès !')
      } else if (userFormMode === 'edit' && editingUserId !== null) {
        const data = await updateSettingsUser(editingUserId, {
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          address: userForm.address.trim(),
        })
        setUsers((current) => current.map((u) => (u.id === editingUserId ? data.user : u)))
        toast.success('Utilisateur mis à jour !')
      }
      closeUserForm()
    } catch (err: any) {
      toast.error(err?.message || "Échec de l'opération sur l'utilisateur")
    } finally {
      setSubmittingUser(false)
    }
  }

  // Suppression réelle d'un utilisateur
  const handleDeleteUser = async (user: UserAccount) => {
    if (!window.confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} ?`)) {
      return
    }

    setDeletingUserId(user.id)
    try {
      await deleteSettingsUser(user.id)
      setUsers((current) => current.filter((u) => u.id !== user.id))
      setSelectedUsers((current) => current.filter((id) => id !== user.id))
      toast.success('Utilisateur supprimé')
    } catch (err: any) {
      toast.error(err?.message || 'Échec de la suppression')
    } finally {
      setDeletingUserId(null)
    }
  }

  // === Projets (groupes) ===
  const openCreateProject = () => {
    setProjectForm(emptyProjectForm)
    setEditingProjectId(null)
    setProjectFormMode('create')
  }

  const openEditProject = (item: ProjectItem) => {
    setProjectForm({
      name: item.label,
      style: item.style || '',
      location: item.location || '',
      bio: item.bio || '',
      musicBrainzArtistId: item.musicBrainzArtistId || '',
    })
    setEditingProjectId(item.id)
    setProjectFormMode('edit')
  }

  const closeProjectForm = () => {
    setProjectFormMode(null)
    setEditingProjectId(null)
    setProjectForm(emptyProjectForm)
  }

  const updateProjectFormField = (field: keyof ProjectFormState, value: string) => {
    setProjectForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmitProject = async (e: FormEvent) => {
    e.preventDefault()

    if (!projectForm.name.trim() || !projectForm.style.trim() || !projectForm.location.trim()) {
      toast.error('Nom, style et localisation sont obligatoires')
      return
    }

    setSubmittingProject(true)
    try {
      if (projectFormMode === 'create') {
        const data = await createProject({
          name: projectForm.name.trim(),
          style: projectForm.style.trim(),
          location: projectForm.location.trim(),
          bio: projectForm.bio.trim(),
          musicBrainzArtistId: projectForm.musicBrainzArtistId.trim(),
        })
        setProjectsList((current) => [...current, data.project])
        setProject(data.project.value)
        toast.success('Projet créé avec succès !')
      } else if (projectFormMode === 'edit' && editingProjectId !== null) {
        const data = await updateProject(editingProjectId, {
          name: projectForm.name.trim(),
          style: projectForm.style.trim(),
          location: projectForm.location.trim(),
          bio: projectForm.bio.trim(),
          musicBrainzArtistId: projectForm.musicBrainzArtistId.trim(),
        })
        setProjectsList((current) => current.map((p) => (p.id === editingProjectId ? data.project : p)))
        toast.success('Projet mis à jour !')
      }
      closeProjectForm()
    } catch (err: any) {
      toast.error(err?.message || "Échec de l'opération sur le projet")
    } finally {
      setSubmittingProject(false)
    }
  }

  const handleDeleteProject = async (item: ProjectItem) => {
    if (!window.confirm(`Supprimer le projet « ${item.label} » et tout son lineup ?`)) {
      return
    }

    try {
      await deleteProject(item.id)
      setProjectsList((current) => current.filter((p) => p.id !== item.id))
      setBandMembers((current) => current.filter((m) => m.projectId !== item.id))
      setProject((current) => {
        if (current !== item.value) {
          return current
        }
        const remaining = projectsList.filter((p) => p.id !== item.id)
        return remaining.length > 0 ? remaining[0].value : ''
      })
      toast.success('Projet supprimé')
    } catch (err: any) {
      toast.error(err?.message || 'Échec de la suppression du projet')
    }
  }

  // === Membres (lineup) ===
  const selectedProjectId = projectsList.find((p) => p.value === project)?.id ?? null
  const visibleMembers = bandMembers.filter((m) => m.projectId === selectedProjectId)

  const openCreateMember = () => {
    if (!selectedProjectId) {
      toast.error("Crée d'abord un projet pour y ajouter des musiciens")
      return
    }
    setMemberForm({ ...emptyMemberForm, projectId: selectedProjectId })
    setEditingMemberId(null)
    setMemberFormMode('create')
  }

  const openEditMember = (member: BandMember) => {
    setMemberForm({
      name: member.name,
      role: member.role,
      projectId: member.projectId ?? selectedProjectId ?? null,
    })
    setEditingMemberId(member.id)
    setMemberFormMode('edit')
  }

  const closeMemberForm = () => {
    setMemberFormMode(null)
    setEditingMemberId(null)
    setMemberForm(emptyMemberForm)
  }

  const updateMemberFormField = (field: keyof MemberFormState, value: string | number | null) => {
    setMemberForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmitMember = async (e: FormEvent) => {
    e.preventDefault()

    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      toast.error('Le nom et le rôle du musicien sont obligatoires')
      return
    }

    const targetProjectId = memberForm.projectId ?? selectedProjectId
    if (!targetProjectId) {
      toast.error('Aucun projet sélectionné')
      return
    }

    setSubmittingMember(true)
    try {
      if (memberFormMode === 'create') {
        const data = await createMember({
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          projectId: targetProjectId,
        })
        setBandMembers((current) => [...current, data.member])
        toast.success('Musicien ajouté au lineup !')
      } else if (memberFormMode === 'edit' && editingMemberId !== null) {
        const data = await updateMember(editingMemberId, {
          name: memberForm.name.trim(),
          role: memberForm.role.trim(),
          projectId: targetProjectId,
        })
        setBandMembers((current) => current.map((m) => (m.id === editingMemberId ? data.member : m)))
        toast.success('Musicien mis à jour !')
      }
      closeMemberForm()
    } catch (err: any) {
      toast.error(err?.message || "Échec de l'opération sur le musicien")
    } finally {
      setSubmittingMember(false)
    }
  }

  const handleDeleteMember = async (member: BandMember) => {
    if (!window.confirm(`Retirer ${member.name} du lineup ?`)) {
      return
    }

    try {
      await deleteMember(member.id)
      setBandMembers((current) => current.filter((m) => m.id !== member.id))
      toast.success('Musicien retiré du lineup')
    } catch (err: any) {
      toast.error(err?.message || 'Échec de la suppression du musicien')
    }
  }

  // Soumettre les modifications globales de configurations
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Dans le cadre du MVP, on simule l'enregistrement en toastant le succès,
      // tout en validant techniquement le payload.
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success('Réglages globaux sauvegardés avec succès !')
    } catch {
      toast.error('Échec de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell>
      <Toaster position="top-right" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px', fontWeight: 600 }}>
            Configurations globales
          </p>
          <h1 style={{ margin: '8px 0 0', color: '#0f172a', fontSize: '32px', fontWeight: 700 }}>Paramètres</h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '8px', color: '#64748b' }}>
            <RefreshCw className="animate-spin" size={24} />
            Chargement des configurations administratives...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Barre latérale d'onglets de navigation */}
            <aside
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px 12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                position: 'sticky',
                top: 24,
              }}
            >
              <div style={{ display: 'grid', gap: '8px' }}>
                {tabItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 14px',
                        border: 'none',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                        borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                        color: isActive ? '#1d4ed8' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc'
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon size={16} />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Corps du panneau de configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  minHeight: '400px',
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                
                {/* ONGLET 1 : PROJETS & MEMBRES */}
                {activeTab === 'profile' && (
                  <section style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Band & Projets</h2>
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Gère les projets actifs de ton groupe et l’effectif associé au lineup.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }} htmlFor="project-select">
                          Projet Courant (Actif)
                        </label>
                        <select
                          id="project-select"
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          style={{
                            width: '100%',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            padding: '10px 14px',
                            fontSize: '14px',
                            color: '#0f172a',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          {projectsList.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'grid', gap: '12px', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#334155' }}>Projets du groupe</p>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                              Ajoute, modifie ou retire les projets disponibles dans l’application.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={openCreateProject}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              padding: '10px 14px',
                              backgroundColor: '#3b82f6',
                              color: '#ffffff',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            <FolderHeart size={14} /> Ajouter un projet
                          </button>
                        </div>

                        <div style={{ display: 'grid', gap: '10px' }}>
                          {projectsList.map((projectItem) => (
                            <div key={projectItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{projectItem.label}</p>
                                <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>
                                  {projectItem.style || 'Style à définir'} · {projectItem.location || 'Localisation à définir'}
                                </p>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="button" onClick={() => openEditProject(projectItem)} style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', cursor: 'pointer' }} aria-label={`Éditer ${projectItem.label}`}>
                                  <Pencil size={14} color="#334155" />
                                </button>
                                <button type="button" onClick={() => handleDeleteProject(projectItem)} style={{ border: '1px solid #fecaca', backgroundColor: '#fff1f2', borderRadius: '8px', padding: '8px', cursor: 'pointer' }} aria-label={`Supprimer ${projectItem.label}`}>
                                  <Trash2 size={14} color="#dc2626" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: '12px', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#334155' }}>Lineup & Roster</p>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                              Composition actuelle des musiciens affiliés au groupe sélectionné.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={openCreateMember}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              padding: '10px 14px',
                              backgroundColor: '#10b981',
                              color: '#ffffff',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            <UserPlus size={14} /> Ajouter un musicien
                          </button>
                        </div>

                        <div style={{ display: 'grid', gap: '10px' }}>
                          {visibleMembers.length === 0 ? (
                            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '13px' }}>
                              Aucun musicien enregistré pour ce projet pour le moment.
                            </div>
                          ) : (
                            visibleMembers.map((member) => (
                              <div
                                key={member.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '16px',
                                  padding: '12px 16px',
                                  borderRadius: '12px',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                }}
                              >
                                <div>
                                  <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{member.name}</p>
                                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>{member.role}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button type="button" onClick={() => openEditMember(member)} style={{ border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', cursor: 'pointer' }} aria-label={`Éditer ${member.name}`}>
                                    <Pencil size={14} color="#334155" />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteMember(member)} style={{ border: '1px solid #fecaca', backgroundColor: '#fff1f2', borderRadius: '8px', padding: '8px', cursor: 'pointer' }} aria-label={`Retirer ${member.name}`}>
                                    <Trash2 size={14} color="#dc2626" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ONGLET 2 : CLIENTS ET UTILISATEURS */}
                {activeTab === 'users' && (
                  <section style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Gestion des utilisateurs</h2>
                        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                          Attribue et révoque les invitations et accréditations d'accès des administrateurs tiers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openCreateUser}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          padding: '10px 16px',
                          backgroundColor: '#3b82f6',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                        }}
                      >
                        <UserPlus size={14} /> Ajouter un utilisateur
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <div style={{ minWidth: '700px', display: 'grid', gap: '8px' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 2.5fr 1.3fr 1fr 1fr',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '12px 14px',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#475569',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleAllUsers}
                            style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
                          />
                          <span>Nom / Adresse Email</span>
                          <span>Projet Actif</span>
                          <span>Permissions</span>
                          <span style={{ textAlign: 'right' }}>Actions</span>
                        </div>

                        {users.length === 0 && (
                          <div
                            style={{
                              padding: '32px',
                              textAlign: 'center',
                              color: '#94a3b8',
                              fontSize: '14px',
                              borderRadius: '12px',
                              backgroundColor: '#f8fafc',
                              border: '1px dashed #cbd5e1',
                            }}
                          >
                            Aucun utilisateur enregistré. Clique sur « Ajouter un utilisateur » pour commencer.
                          </div>
                        )}

                        {users.map((user) => {
                          const isSelected = selectedUsers.includes(user.id)
                          return (
                            <div
                              key={user.id}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 2.5fr 1.3fr 1fr 1fr',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '14px',
                                borderRadius: '12px',
                                backgroundColor: isSelected ? '#f0fdf4' : '#f8fafc',
                                border: `1px solid ${isSelected ? '#bbf7d0' : '#f1f5f9'}`,
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleUserSelection(user.id)}
                                style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
                              />
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                                  {user.firstName} {user.lastName}
                                </p>
                                <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>{user.email}</p>
                              </div>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#e2e8f0',
                                  color: '#334155',
                                  borderRadius: '9999px',
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                {user.project}
                              </span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#eff6ff',
                                  color: '#1d4ed8',
                                  borderRadius: '9999px',
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                {user.role}
                              </span>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => setActiveUserProfile(user)}
                                  style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditUser(user)}
                                  style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(user)}
                                  disabled={deletingUserId === user.id}
                                  style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: deletingUserId === user.id ? 'wait' : 'pointer', padding: '6px', borderRadius: '6px', opacity: deletingUserId === user.id ? 0.5 : 1 }}
                                >
                                  {deletingUserId === user.id ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </section>
                )}

                {/* ONGLET 3 : INTÉGRATIONS & CLÉS */}
                {activeTab === 'integrations' && (
                  <section style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Intégrations Services</h2>
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Configure tes identifiants de streaming et de récupération de métadonnées musicales.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                      {[
                        { id: 'musicbrainz', label: 'MusicBrainz Artist ID', value: musicBrainzId, helper: 'Requis pour synchroniser les métadonnées de discographie', type: 'text', setter: setMusicBrainzId },
                        { id: 'spotify', label: 'Spotify Client Secret', value: spotifySecret, helper: 'Clé secrète de connexion API Spotify', type: 'password', setter: setSpotifySecret },
                        { id: 'deezer', label: 'Deezer Developer Key', value: deezerKey, helper: 'Clé de connexion au widget d\'écoute Deezer', type: 'text', setter: setDeezerKey },
                      ].map((input) => (
                        <div
                          key={input.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor={input.id} style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                              {input.label}
                            </label>
                            <span
                              style={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                borderRadius: '9999px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              Actif
                            </span>
                          </div>
                          <input
                            id={input.id}
                            type={input.type}
                            value={input.value}
                            onChange={(e) => input.setter(e.target.value)}
                            style={{
                              width: '100%',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              padding: '10px 12px',
                              fontSize: '14px',
                              color: '#0f172a',
                              backgroundColor: '#ffffff',
                              boxSizing: 'border-box',
                            }}
                          />
                          {input.helper && (
                            <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>{input.helper}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ONGLET 4 : STOCKAGE NUAGE/CLOUD */}
                {activeTab === 'storage' && (
                  <section style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Espaces de Stockage Cloud</h2>
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Suivi de téraoctets consommés et serveurs d\'hébergement reliés au lecteur de fichiers.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Google Drive</p>
                          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                            État : Connecté | Volume : 24.5 Go / 50 GB consommés
                          </p>
                        </div>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
                          Connecté
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>AWS S3 Bucket</p>
                          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                            État : Non connecté
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast.success("Configuration AWS S3 lancée")}
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Configurer
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Serveur Local de Stockage (Le Frigo)</p>
                          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                            État : Connecté | Volume : 124 Go / 500 GB
                          </p>
                        </div>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
                          Connecté
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {/* ONGLET 5 : PRÉFÉRENCES APPS & TOGGLES */}
                {activeTab === 'preferences' && (
                  <section style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Préférences d'Application</h2>
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
                        Ajuste l'habillage graphique et filtre les types d'alertes à recevoir.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                      <div style={{ display: 'grid', gap: '12px', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Thème d'affichage</p>
                          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Bascule la palette de couleurs générale.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {['light', 'dark', 'system'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setTheme(option)
                                toast.success(`Profil basculé en mode ${option}`)
                              }}
                              style={{
                                flex: 1,
                                minWidth: '90px',
                                borderRadius: '8px',
                                border: `1px solid ${theme === option ? '#3b82f6' : '#cbd5e1'}`,
                                backgroundColor: theme === option ? '#eff6ff' : '#ffffff',
                                color: theme === option ? '#1d4ed8' : '#334155',
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '13px',
                                textTransform: 'capitalize',
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: '12px', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>Préférences de notification</p>
                        <ToggleSwitch
                          id="syncFail"
                          label="M'avertir de tout échec de synchronisation instantanée"
                          checked={notificationSettings.syncFail}
                          onChange={() =>
                            setNotificationSettings((current) => ({
                              ...current,
                              syncFail: !current.syncFail,
                            }))
                          }
                        />
                        <ToggleSwitch
                          id="rehearsalReminder"
                          label="Rappels de répétitions régulières (24h à l'avance)"
                          checked={notificationSettings.rehearsalReminder}
                          onChange={() =>
                            setNotificationSettings((current) => ({
                              ...current,
                              rehearsalReminder: !current.rehearsalReminder,
                            }))
                          }
                        />
                        <ToggleSwitch
                          id="weeklyDigest"
                          label="Recevoir la newsletter hebdomadaire d'audience et stream"
                          checked={notificationSettings.weeklyDigest}
                          onChange={() =>
                            setNotificationSettings((current) => ({
                              ...current,
                              weeklyDigest: !current.weeklyDigest,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </section>
                )}

              </div>

              {/* Bouton de pied de page pour soumettre/valider */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                    transition: 'opacity 0.2s',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Modal de formulaire d'ajout / édition de projet */}
        {projectFormMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 210,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            <form
              onSubmit={handleSubmitProject}
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <button
                type="button"
                onClick={closeProjectForm}
                style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '6px' }}
              >
                <X size={18} />
              </button>

              <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {projectFormMode === 'create' ? 'Ajouter un projet' : 'Modifier le projet'}
              </h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
                {projectFormMode === 'create' ? 'Crée un nouveau projet de groupe et prépare son lineup.' : 'Mets à jour les informations du projet sélectionné.'}
              </p>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="project-name">Nom</label>
                  <input id="project-name" value={projectForm.name} onChange={(e) => updateProjectFormField('name', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="project-style">Style</label>
                  <input id="project-style" value={projectForm.style} onChange={(e) => updateProjectFormField('style', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="project-location">Localisation</label>
                  <input id="project-location" value={projectForm.location} onChange={(e) => updateProjectFormField('location', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="project-bio">Bio</label>
                  <textarea id="project-bio" value={projectForm.bio} onChange={(e) => updateProjectFormField('bio', e.target.value)} rows={3} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="project-mbid">MusicBrainz Artist ID</label>
                  <input id="project-mbid" value={projectForm.musicBrainzArtistId} onChange={(e) => updateProjectFormField('musicBrainzArtistId', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={closeProjectForm} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
                  Annuler
                </button>
                <button type="submit" disabled={submittingProject} style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}>
                  {submittingProject ? 'Enregistrement...' : projectFormMode === 'create' ? 'Créer le projet' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de formulaire d'ajout / édition de musicien */}
        {memberFormMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 210,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            <form
              onSubmit={handleSubmitMember}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              }}
            >
              <button
                type="button"
                onClick={closeMemberForm}
                style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '6px' }}
              >
                <X size={18} />
              </button>

              <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {memberFormMode === 'create' ? 'Ajouter un musicien' : 'Modifier le musicien'}
              </h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
                {memberFormMode === 'create' ? 'Ajoute un membre au lineup du projet actif.' : 'Mets à jour les informations du musicien sélectionné.'}
              </p>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="member-name">Nom</label>
                  <input id="member-name" value={memberForm.name} onChange={(e) => updateMemberFormField('name', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="member-role">Rôle</label>
                  <input id="member-role" value={memberForm.role} onChange={(e) => updateMemberFormField('role', e.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }} htmlFor="member-project">Projet associé</label>
                  <select
                    id="member-project"
                    value={memberForm.projectId ?? ''}
                    onChange={(e) => updateMemberFormField('projectId', e.target.value === '' ? null : Number(e.target.value))}
                    style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', backgroundColor: '#f8fafc' }}
                  >
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={closeMemberForm} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
                  Annuler
                </button>
                <button type="submit" disabled={submittingMember} style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}>
                  {submittingMember ? 'Enregistrement...' : memberFormMode === 'create' ? 'Ajouter le musicien' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de consultation détaillée de l'utilisateur actif */}
        {activeUserProfile && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', position: 'relative', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <button
                type="button"
                onClick={() => setActiveUserProfile(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={18} />
              </button>
              
              <div style={{ display: 'grid', gap: '16px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '22px',
                    fontWeight: 700,
                  }}
                >
                  {`${activeUserProfile.firstName[0]}${activeUserProfile.lastName[0]}`}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                    {activeUserProfile.firstName} {activeUserProfile.lastName}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{activeUserProfile.email}</p>
                </div>

                <div style={{ display: 'grid', gap: '12px', textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: '16px', fontSize: '13px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#475569', fontWeight: 700 }}>Projet d'affectation</p>
                    <span style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '9999px', padding: '4px 10px', fontWeight: 700 }}>
                      {activeUserProfile.project}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#475569', fontWeight: 700 }}>Niveau d'accréditations</p>
                    <span style={{ display: 'inline-flex', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '9999px', padding: '4px 10px', fontWeight: 700 }}>
                      {activeUserProfile.role}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#475569', fontWeight: 700 }}>Adresse postale</p>
                    <p style={{ margin: 0, color: '#475569' }}>{activeUserProfile.address}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', color: '#475569', fontWeight: 700 }}>Téléphone direct</p>
                    <p style={{ margin: 0, color: '#475569' }}>{activeUserProfile.phone}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveUserProfile(null)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    marginTop: '8px',
                    fontSize: '13px',
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de formulaire d'ajout / édition d'utilisateur */}
        {userFormMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 210,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
            }}
          >
            <form
              onSubmit={handleSubmitUser}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <button
                type="button"
                onClick={closeUserForm}
                style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', padding: '6px' }}
              >
                <X size={18} />
              </button>

              <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {userFormMode === 'create' ? 'Ajouter un utilisateur' : "Modifier l'utilisateur"}
              </h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
                {userFormMode === 'create'
                  ? 'Crée un nouvel accès administrateur persistant en base de données.'
                  : 'Mets à jour les informations du compte sélectionné.'}
              </p>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Prénom *</label>
                    <input
                      type="text"
                      value={userForm.firstName}
                      onChange={(e) => updateUserFormField('firstName', e.target.value)}
                      style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Nom *</label>
                    <input
                      type="text"
                      value={userForm.lastName}
                      onChange={(e) => updateUserFormField('lastName', e.target.value)}
                      style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Adresse email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => updateUserFormField('email', e.target.value)}
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                {userFormMode === 'create' && (
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Mot de passe initial *</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => updateUserFormField('password', e.target.value)}
                      placeholder="Minimum 6 caractères"
                      style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Téléphone</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => updateUserFormField('phone', e.target.value)}
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Adresse postale</label>
                  <input
                    type="text"
                    value={userForm.address}
                    onChange={(e) => updateUserFormField('address', e.target.value)}
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={closeUserForm}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#3b82f6',
                    color: '#ffffff',
                    cursor: submittingUser ? 'wait' : 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                    opacity: submittingUser ? 0.7 : 1,
                  }}
                >
                  {submittingUser ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check size={15} /> {userFormMode === 'create' ? 'Créer le compte' : 'Enregistrer'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  )
}
