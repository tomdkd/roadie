import { useState } from 'react';
import { Mail, HelpCircle, Send, X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Switch } from '../../../../components/ui/Switch';

export function NotificationsTab() {
  const [notifSubTab, setNotifSubTab] = useState<'email' | 'discord'>('email');
  const [isDiscordHelpOpen, setIsDiscordHelpOpen] = useState(false);
  const [discordWebhook, setDiscordWebhook] = useState(
    'https://discord.com/api/webhooks/...',
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // État des notifications
  const [notifSettings, setNotifSettings] = useState({
    // Email
    emailConcertReminder: true,
    emailConcertCreated: true,
    emailConcertUpdated: false,
    emailConcertCanceled: true,
    emailDocCreated: true,
    emailDocUpdated: false,
    emailDocDeleted: false,
    emailSetlistCreated: true,
    emailSetlistUpdated: true,
    emailSetlistDeleted: false,

    // Discord
    discordConcertReminder: true,
    discordConcertCreated: true,
    discordConcertUpdated: true,
    discordConcertCanceled: true,
    discordDocCreated: true,
    discordDocUpdated: false,
    discordDocDeleted: false,
    discordSetlistCreated: true,
    discordSetlistUpdated: true,
    discordSetlistDeleted: false,
  });

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDiscord = notifSubTab === 'discord';
  const prefix = isDiscord ? 'discord' : 'email';
  const themeColor = isDiscord ? 'indigo' : 'blue';

  return (
    <div className="flex min-h-0 max-w-3xl flex-1 flex-col space-y-3">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* En-tête + Sous-onglets */}
        <div className="flex shrink-0 flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Préférences de notifications
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Activer les alertes instantanées par canal pour ton équipe.
            </p>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:w-52 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setNotifSubTab('email')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1 text-xs transition-all ${
                notifSubTab === 'email'
                  ? 'bg-white font-bold text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => setNotifSubTab('discord')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1 text-xs transition-all ${
                notifSubTab === 'discord'
                  ? 'bg-white font-bold text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span className="font-black">#</span>
              <span>Discord</span>
            </button>
          </div>
        </div>

        {/* Zone Webhook Discord */}
        {isDiscord && (
          <div className="mt-3 shrink-0 rounded-xl border border-indigo-100 bg-indigo-50/40 p-2.5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <Input
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="URL Webhook Discord (https://discord.com/api/webhooks/...)"
                  className="py-1.5 text-xs"
                />
              </div>
              <Button
                variant="outline"
                disabled={isTestingWebhook}
                onClick={() => {
                  setIsTestingWebhook(true);
                  setTimeout(() => {
                    setIsTestingWebhook(false);
                    alert('Message de test envoyé sur Discord ! 🚀');
                  }, 1200);
                }}
                className="shrink-0 gap-1.5 py-1.5 text-xs"
              >
                <Send
                  className={`h-3 w-3 ${isTestingWebhook ? 'animate-bounce' : ''}`}
                />
                <span>{isTestingWebhook ? 'Envoi...' : 'Tester'}</span>
              </Button>
              <button
                type="button"
                onClick={() => setIsDiscordHelpOpen(true)}
                className="p-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                title="Aide Webhook"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* GRILLE ADAPTATIVE DE CARTES NOTIFICATIONS */}
        <div className="flex-1 space-y-4 pt-3">
          {/* CONCERTS */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <span>🗓️</span> Concerts & Dates
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Switch
                variant={themeColor}
                label="Rappel J-1"
                checked={
                  notifSettings[
                    `${prefix}ConcertReminder` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}ConcertReminder` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Nouveau concert"
                checked={
                  notifSettings[
                    `${prefix}ConcertCreated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}ConcertCreated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Infos modifiées"
                checked={
                  notifSettings[
                    `${prefix}ConcertUpdated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}ConcertUpdated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Concert annulé"
                checked={
                  notifSettings[
                    `${prefix}ConcertCanceled` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}ConcertCanceled` as keyof typeof notifSettings,
                  )
                }
              />
            </div>
          </div>

          {/* DOCUMENTS */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <span>📁</span> Documents & Fiches techniques
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Switch
                variant={themeColor}
                label="Fichier ajouté"
                checked={
                  notifSettings[
                    `${prefix}DocCreated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}DocCreated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Fichier mis à jour"
                checked={
                  notifSettings[
                    `${prefix}DocUpdated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}DocUpdated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Fichier supprimé"
                checked={
                  notifSettings[
                    `${prefix}DocDeleted` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}DocDeleted` as keyof typeof notifSettings,
                  )
                }
              />
            </div>
          </div>

          {/* SETLISTS */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <span>🎼</span> Setlists & Morceaux
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Switch
                variant={themeColor}
                label="Setlist créée"
                checked={
                  notifSettings[
                    `${prefix}SetlistCreated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}SetlistCreated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Morceau / Ordre modifié"
                checked={
                  notifSettings[
                    `${prefix}SetlistUpdated` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}SetlistUpdated` as keyof typeof notifSettings,
                  )
                }
              />
              <Switch
                variant={themeColor}
                label="Setlist supprimée"
                checked={
                  notifSettings[
                    `${prefix}SetlistDeleted` as keyof typeof notifSettings
                  ]
                }
                onCheckedChange={() =>
                  toggleNotif(
                    `${prefix}SetlistDeleted` as keyof typeof notifSettings,
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Pied de carte */}
        <div className="mt-3 shrink-0 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <Button className="px-5 py-1.5 text-xs">
            Enregistrer les préférences
          </Button>
        </div>
      </div>

      {/* MODALE D'AIDE DISCORD */}
      {isDiscordHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  #
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Créer un Webhook Discord
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDiscordHelpOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                1. Ouvre Discord ⚙️ dans le salon désiré (ex:{' '}
                <code>#concerts</code>).
              </p>
              <p>
                2. Va dans **Intégrations** ➔ **Webhooks** ➔ **Créer un
                Webhook**.
              </p>
              <p>
                3. Copie l'URL générée et colle-la dans le champ sur Roadie !
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={() => setIsDiscordHelpOpen(false)}
                className="py-1 text-xs"
              >
                J'ai compris
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
