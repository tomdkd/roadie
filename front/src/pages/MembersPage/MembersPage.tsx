import { useState } from 'react';
import {
  Search,
  UserPlus,
  ChevronDown,
  Pencil,
  UserX,
  Shield,
  FilterX,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { ToastMessage } from '../../components/ui/Toast';

export type RolePermission = 'admin' | 'editor' | 'viewer';

export interface ProjectMember {
  id: string;
  firstName: string;
  lastName: string;
  instrument: string;
  role: RolePermission;
  email: string;
  avatarBg: string;
}

const INITIAL_MEMBERS: ProjectMember[] = [
  {
    id: '1',
    firstName: 'Jimi',
    lastName: 'Hendrix',
    instrument: 'Guitariste Lead',
    role: 'admin',
    email: 'jimi.hendrix@roadie.music',
    avatarBg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
  {
    id: '2',
    firstName: 'Alex',
    lastName: 'Turner',
    instrument: 'Chanteur / Guitariste',
    role: 'editor',
    email: 'alex.turner@roadie.music',
    avatarBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    id: '3',
    firstName: 'Dave',
    lastName: 'Grohl',
    instrument: 'Batteur',
    role: 'admin',
    email: 'dave.grohl@roadie.music',
    avatarBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: '4',
    firstName: 'Flea',
    lastName: 'Balzary',
    instrument: 'Bassiste',
    role: 'editor',
    email: 'flea@roadie.music',
    avatarBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  },
  {
    id: '5',
    firstName: 'Paul',
    lastName: 'McCartney',
    instrument: 'Guitariste Rythmique',
    role: 'viewer',
    email: 'paul.mccartney@roadie.music',
    avatarBg: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
  },
];

export function MembersPage() {
  const [members, setMembers] = useState<ProjectMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');

  // État du Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Membre sélectionné pour exclusion
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ id: crypto.randomUUID(), message, type });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setInstrumentFilter('all');
  };

  // Filtrage des membres
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.instrument.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesInstrument =
      instrumentFilter === 'all' || member.instrument === instrumentFilter;

    return matchesSearch && matchesRole && matchesInstrument;
  });

  // Action d'exclusion d'un membre
  const confirmRemoveMember = () => {
    if (!memberToRemove) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    showToast(
      `${memberToRemove.firstName} ${memberToRemove.lastName} a été retiré(e) du projet.`,
      'info'
    );
    setMemberToRemove(null);
  };

  const getPermissionBadge = (role: RolePermission) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            Éditeur
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Lecteur
          </span>
        );
    }
  };

  // Extrait des instruments uniques pour le filtre
  const uniqueInstruments = Array.from(new Set(members.map((m) => m.instrument)));

  const isFilterActive =
    searchQuery !== '' || roleFilter !== 'all' || instrumentFilter !== 'all';

  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-y-auto pr-1">
      {/* EN-TÊTE PAGE */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
            Membres du projet
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Gère l'équipe, les instruments et les niveaux d'accès au projet.
          </p>
        </div>

        <Button className="py-2 px-3 text-xs gap-1.5 self-start sm:self-auto">
          <UserPlus className="h-4 w-4 shrink-0" />
          <span>Inviter un membre</span>
        </Button>
      </div>

      {/* BARRE D'ACTIONS : RECHERCHE + FILTRES COLONNES */}
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        {/* RECHERCHE NOM / PRÉNOM / EMAIL */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* FILTRES PAR COLONNES */}
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          {/* FILTRE PAR RÔLE / INSTRUMENT */}
          <div className="relative w-full sm:w-auto">
            <select
              value={instrumentFilter}
              onChange={(e) => setInstrumentFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 truncate"
            >
              <option value="all">Tous les rôles / instruments</option>
              {uniqueInstruments.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* FILTRE PAR DROITS / PERMISSIONS */}
          <div className="relative w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 truncate"
            >
              <option value="all">Tous les droits</option>
              <option value="admin">Admin</option>
              <option value="editor">Éditeur</option>
              <option value="viewer">Lecteur</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* TABLEAU DES MEMBRES */}
      {filteredMembers.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              {/* EN-TÊTE DU TABLEAU */}
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Membre</th>
                  <th scope="col" className="px-4 py-3">Rôle / Instrument</th>
                  <th scope="col" className="px-4 py-3">Droits</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              {/* CORPS DU TABLEAU */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    {/* NOM + PRÉNOM + AVATAR */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${member.avatarBg}`}
                        >
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* RÔLE MUSICAL / INSTRUMENT */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                      {member.instrument}
                    </td>

                    {/* PERMISSION BADGE */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getPermissionBadge(member.role)}
                    </td>

                    {/* ACTIONS : MODIFIER & EXCLURE */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              `Édition des accès de ${member.firstName} ${member.lastName}`,
                              'info'
                            )
                          }
                          title="Modifier les droits"
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setMemberToRemove(member)}
                          title="Exclure du projet"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ÉTAT VIDE (FILTRES SANS RÉSULTAT) */
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40 my-4">
          {isFilterActive ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
                <FilterX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aucun membre trouvé
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Aucun membre ne correspond à vos filtres de recherche actuels.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="py-1.5 px-3 text-xs mt-2"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aucun membre dans le projet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Invite tes musiciens et techniciens pour démarrer la collaboration.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALE DE CONFIRMATION D'EXCLUSION */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <UserX className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Exclure du projet ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cette action retirera les accès au membre.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              Es-tu sûr de vouloir retirer{' '}
              <strong>
                {memberToRemove.firstName} {memberToRemove.lastName}
              </strong>{' '}
              du projet ? Il/Elle ne pourra plus accéder aux setlists et événements.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setMemberToRemove(null)}
                className="py-1.5 text-xs"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmRemoveMember}
                className="py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white border-0"
              >
                Exclure le membre
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <Toast key={toast?.id} toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}