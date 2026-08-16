// todo replace by api provider
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

export const DocumentsProvider = {
  async getDocuments(): Promise<GroupDocument[]> {
    return Promise.resolve(INITIAL_DOCUMENTS);
  },
};
