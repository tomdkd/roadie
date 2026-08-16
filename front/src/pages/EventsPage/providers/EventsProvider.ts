// todo replace by api provider
export type EventType = 'concert' | 'rehearsal' | 'studio';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  type: EventType;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Concert - Le Zénith',
    start: new Date(2026, 7, 15, 20, 30),
    end: new Date(2026, 7, 15, 23, 0),
    location: 'Zénith de Paris',
    type: 'concert',
  },
  {
    id: '2',
    title: 'Balance & Soundcheck',
    start: new Date(2026, 7, 15, 16, 0),
    end: new Date(2026, 7, 15, 18, 0),
    location: 'Zénith de Paris',
    type: 'concert',
  },
  {
    id: '3',
    title: 'Répétition Générale',
    start: new Date(2026, 7, 12, 14, 0),
    end: new Date(2026, 7, 12, 18, 0),
    location: 'Studio Luna Rossa',
    type: 'rehearsal',
  },
  {
    id: '4',
    title: 'Session Studio Enregistrement',
    start: new Date(2026, 7, 22, 10, 0),
    end: new Date(2026, 7, 22, 19, 0),
    location: 'Studio Guillaume Tell',
    type: 'studio',
  },
];

export const EventsProvider = {
  async getEvents(): Promise<CalendarEvent[]> {
    return Promise.resolve(INITIAL_EVENTS);
  },
};
