// todo replace by api provider
export interface Song {
  id: string;
  title: string;
  album: string;
  duration: string;
  bpm: number;
  key: string;
  tuning: string;
  status: 'ready' | 'rehearsal' | 'draft';
}

const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    album: 'City Lights (2025)',
    duration: '04:15',
    bpm: 124,
    key: 'Am',
    tuning: 'Standard (E)',
    status: 'ready',
  },
  {
    id: '2',
    title: 'Midnight Run',
    album: 'City Lights (2025)',
    duration: '03:48',
    bpm: 138,
    key: 'Em',
    tuning: 'Drop D',
    status: 'ready',
  },
  {
    id: '3',
    title: 'Electric Velvet',
    album: 'Electric Velvet - Expanded Edition', // > 20 caractères pour tester le tronquage
    duration: '05:02',
    bpm: 96,
    key: 'C#m',
    tuning: 'Standard (E)',
    status: 'rehearsal',
  },
  {
    id: '4',
    title: 'Starlight Groove',
    album: 'First Demo',
    duration: '03:30',
    bpm: 115,
    key: 'G',
    tuning: 'Standard (E)',
    status: 'ready',
  },
  {
    id: '5',
    title: 'Unreleased Jam #4',
    album: 'Inédit',
    duration: '02:45',
    bpm: 140,
    key: 'Dm',
    tuning: 'Standard (E)',
    status: 'draft',
  },
];

export const SongsProvider = {
  async getSongs(): Promise<Song[]> {
    return Promise.resolve(INITIAL_SONGS);
  },
};
