// todo replace by api provider
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

export const MembersProvider = {
  async getMembers(): Promise<ProjectMember[]> {
    return Promise.resolve(INITIAL_MEMBERS);
  },
};
