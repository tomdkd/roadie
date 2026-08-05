import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import {
  Calendar as CalendarIcon,
  Plus,
  MapPin,
  Clock,
  Music,
  Mic2,
  Radio,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { ToastMessage } from '../../components/ui/Toast';
import type { ToolbarProps, View } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuration du localiseur date-fns en français
const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

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

// BARRE D'OUTILS ET DE NAVIGATION CUSTOM (Light + Dark Mode)
function CustomToolbar({ label, onView, view, onNavigate }: ToolbarProps<CalendarEvent>) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation (Aujourd'hui, Précédent, Suivant) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate('TODAY')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Aujourd'hui
        </button>
        <button
          type="button"
          onClick={() => onNavigate('PREV')}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('NEXT')}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Titre central Mois / Année */}
      <h2 className="text-base font-black capitalize text-slate-900 dark:text-white">
        {label}
      </h2>

      {/* Selecteur de Vue (Mois, Semaine, Jour, Agenda) */}
      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {(['month', 'week', 'day', 'agenda'] as View[]).map((v) => {
          const labels: Record<string, string> = {
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
          };
          const isActive = view === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onView(v)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {labels[v]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EventsPage() {
  const [events] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentView, setCurrentView] = useState<View>('month');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    setToast({ id: crypto.randomUUID(), message, type });
  };

  const filteredEvents = useMemo(() => {
    if (selectedType === 'all') return events;
    return events.filter((e) => e.type === selectedType);
  }, [events, selectedType]);

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'concert':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <Music className="h-3 w-3" /> Concert
          </span>
        );
      case 'rehearsal':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Mic2 className="h-3 w-3" /> Répétition
          </span>
        );
      case 'studio':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Radio className="h-3 w-3" /> Studio
          </span>
        );
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6';
    if (event.type === 'concert') backgroundColor = '#8b5cf6';
    if (event.type === 'studio') backgroundColor = '#f59e0b';

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '3px 8px',
      },
    };
  };

  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-y-auto pr-1">
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
            <span>Planning & Événements</span>
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Concerts, répétitions et sessions d'enregistrement.
          </p>
        </div>

        <Button
          onClick={() => showToast('Modale de création d\'événement à venir', 'info')}
          className="py-2 px-3 text-xs gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Créer un événement</span>
        </Button>
      </div>

      {/* BARRE DE FILTRES PAR TYPE */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400 ml-1 shrink-0" />
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all whitespace-nowrap ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('concert')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all whitespace-nowrap ${
              selectedType === 'concert'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Concerts
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('rehearsal')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all whitespace-nowrap ${
              selectedType === 'rehearsal'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Répétitions
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('studio')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all whitespace-nowrap ${
              selectedType === 'studio'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Studio
          </button>
        </div>
      </div>

      {/* VUE MOBILE : AGENDA COMPACT */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => showToast(`Sélection : ${evt.title}`)}
            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {evt.title}
              </h3>
              {getEventBadge(evt.type)}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>
                  {format(evt.start, 'dd MMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>

              {evt.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VUE DESKTOP : CALENDRIER TOUTES VUES (MOIS, SEMAINE, JOUR, AGENDA) */}
      <div className="hidden md:block flex-1 min-h-[520px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900
        /* ---------------- VUE MOIS ---------------- */
        [&_.rbc-month-view]:!border-slate-200 dark:[&_.rbc-month-view]:!border-slate-800 
        [&_.rbc-month-view]:!bg-white dark:[&_.rbc-month-view]:!bg-slate-900 
        [&_.rbc-month-view]:!rounded-xl [&_.rbc-month-view]:!overflow-hidden
        [&_.rbc-header]:!border-slate-200 dark:[&_.rbc-header]:!border-slate-800 
        [&_.rbc-header]:!bg-slate-50 dark:[&_.rbc-header]:!bg-slate-900 
        [&_.rbc-header]:!py-2 [&_.rbc-header]:!text-xs [&_.rbc-header]:!font-bold [&_.rbc-header]:!uppercase 
        [&_.rbc-header]:!text-slate-600 dark:[&_.rbc-header]:!text-slate-400
        [&_.rbc-month-row]:!border-slate-200 dark:[&_.rbc-month-row]:!border-slate-800
        [&_.rbc-day-bg]:!border-slate-200 dark:[&_.rbc-day-bg]:!border-slate-800/80 
        [&_.rbc-day-bg]:!bg-white dark:[&_.rbc-day-bg]:!bg-slate-900
        [&_.rbc-off-range-bg]:!bg-slate-100/70 dark:[&_.rbc-off-range-bg]:!bg-slate-950/80
        [&_.rbc-off-range]:!text-slate-400 dark:[&_.rbc-off-range]:!text-slate-700
        [&_.rbc-today]:!bg-blue-50/70 dark:[&_.rbc-today]:!bg-blue-950/40
        [&_.rbc-date-cell]:!p-2 [&_.rbc-date-cell]:!text-xs [&_.rbc-date-cell]:!font-bold 
        [&_.rbc-date-cell]:!text-slate-700 dark:[&_.rbc-date-cell]:!text-slate-400
        [&_.rbc-date-cell.rbc-now]:!text-blue-600 dark:[&_.rbc-date-cell.rbc-now]:!text-blue-400

        /* ---------------- VUES SEMAINE & JOUR ---------------- */
        [&_.rbc-time-view]:!border-slate-200 dark:[&_.rbc-time-view]:!border-slate-800
        [&_.rbc-time-view]:!bg-white dark:[&_.rbc-time-view]:!bg-slate-900
        [&_.rbc-time-view]:!rounded-xl [&_.rbc-time-view]:!overflow-hidden
        
        /* Harmonisation de toutes les bordures internes (colonnes et rangées) */
        [&_.rbc-time-view_*]:!border-slate-200 dark:[&_.rbc-time-view_*]:!border-slate-800
        [&_.rbc-time-header-content]:!border-slate-200 dark:[&_.rbc-time-header-content]:!border-slate-800
        [&_.rbc-day-slot]:!bg-white dark:[&_.rbc-day-slot]:!bg-slate-900
        [&_.rbc-time-gutter]:!bg-slate-50/50 dark:[&_.rbc-time-gutter]:!bg-slate-900
        [&_.rbc-allday-cell]:!hidden

        /* Gouttière et labels d'heures */
        [&_.rbc-label]:!text-[11px] [&_.rbc-label]:!font-mono [&_.rbc-label]:!text-slate-500 dark:[&_.rbc-label]:!text-slate-400

        /* Indicator heure actuelle */
        [&_.rbc-current-time-indicator]:!bg-blue-500

        /* ---------------- VUE AGENDA ---------------- */
        [&_.rbc-agenda-view]:!border-slate-200 dark:[&_.rbc-agenda-view]:!border-slate-800
        [&_.rbc-agenda-view_table.rbc-agenda-table]:!border-slate-200 dark:[&_.rbc-agenda-view_table.rbc-agenda-table]:!border-slate-800
        [&_.rbc-agenda-view_table.rbc-agenda-table_tbody_>_tr_>_td]:!border-slate-200 dark:[&_.rbc-agenda-view_table.rbc-agenda-table_tbody_>_tr_>_td]:!border-slate-800
        [&_.rbc-agenda-view_table.rbc-agenda-table_thead_>_tr_>_th]:!border-slate-200 dark:[&_.rbc-agenda-view_table.rbc-agenda-table_thead_>_tr_>_th]:!border-slate-800
        [&_.rbc-agenda-time-cell]:!font-mono [&_.rbc-agenda-time-cell]:!text-xs

        /* Badges événements */
        [&_.rbc-event]:!border-0
      ">
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '520px' }}
          culture="fr"
          views={['month', 'week', 'day', 'agenda']}
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(evt) => showToast(`Détails : ${evt.title}`)}
          components={{
            toolbar: CustomToolbar,
          }}
          messages={{
            noEventsInRange: 'Aucun événement prévu dans cette période.',
          }}
        />
      </div>

      <Toast key={toast?.id} toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}