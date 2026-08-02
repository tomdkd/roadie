import { useState } from 'react';
import { Settings, Ticket, Bell, Calendar } from 'lucide-react';
import { GeneralTab } from './components/GeneralTab';
import { InvitationsTab } from './components/InvitationsTab';
import { NotificationsTab } from './components/NotificationsTab';
import { IntegrationsTab } from './components/IntegrationsTab';

type SettingsTab = 'general' | 'invitations' | 'notifications' | 'integrations';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  return (
    /* On utilise overflow-y-auto pour autoriser le scroll sur mobile et petits écrans */
    <div className="flex h-full flex-col space-y-4 overflow-y-auto pr-1">
      {/* En-tête */}
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
          Paramètres du projet
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Gère les préférences, invitations et intégrations pour{' '}
          <strong className="text-slate-700 dark:text-slate-200">
            The Neon Monkeys
          </strong>
          .
        </p>
      </div>

      {/* Barre d'onglets (scrollable horizontalement sur mobile si besoin) */}
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-200 pb-0.5 sm:gap-6 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-colors ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Général</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invitations')}
          className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-colors ${
            activeTab === 'invitations'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Invitations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-colors ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('integrations')}
          className={`flex shrink-0 items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-colors ${
            activeTab === 'integrations'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="pb-6">
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'invitations' && <InvitationsTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
      </div>
    </div>
  );
}
