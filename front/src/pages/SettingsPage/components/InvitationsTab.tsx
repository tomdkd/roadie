import { useState } from 'react';
import { ChevronDown, RefreshCw, Check, Copy, Trash2 } from 'lucide-react';

interface InvitationCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
  usedBy?: string;
}

const MOCK_INVITATIONS: InvitationCode[] = [
  {
    id: '1',
    code: 'ROADIE-8921',
    createdAt: '02/08/2026',
    expiresAt: '03/08/2026 (dans 24h)',
    status: 'active',
  },
  {
    id: '2',
    code: 'ROADIE-3304',
    createdAt: '28/07/2026',
    expiresAt: '29/07/2026',
    status: 'used',
    usedBy: 'Kurt Cobain',
  },
  {
    id: '3',
    code: 'ROADIE-1102',
    createdAt: '15/07/2026',
    expiresAt: '16/07/2026',
    status: 'expired',
  },
];

export function InvitationsTab() {
  const [invitations, setInvitations] =
    useState<InvitationCode[]>(MOCK_INVITATIONS);
  const [invitationDuration, setInvitationDuration] = useState('24h');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleGenerateCode = () => {
    const randomCode = `ROADIE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: InvitationCode = {
      id: Date.now().toString(),
      code: randomCode,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      expiresAt: 'dans ' + invitationDuration,
      status: 'active',
    };
    setInvitations([newInv, ...invitations]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteInvitation = (id: string) => {
    setInvitations(invitations.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-0 max-w-4xl flex-1 flex-col space-y-4">
      {/* Bloc de génération */}
      <div className="shrink-0 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Générer un code d'invitation
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Crée un lien ou un code à durée limitée pour inviter un membre à
            rejoindre <strong>The Neon Monkeys</strong>.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full shrink-0 sm:w-28">
            <select
              value={invitationDuration}
              onChange={(e) => setInvitationDuration(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pr-7 pl-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="1h">1 heure</option>
              <option value="2h">2 heures</option>
              <option value="5h">5 heures</option>
              <option value="24h">24 heures</option>
              <option value="2d">2 jours</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={
                invitations.length > 0 && invitations[0].status === 'active'
                  ? `https://roadie.app/join?code=${invitations[0].code}`
                  : 'Clique sur Générer pour créer un lien'
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-48 pl-3 font-mono text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            />

            <div className="absolute top-1 right-1 bottom-1 flex items-center gap-1">
              <button
                type="button"
                onClick={handleGenerateCode}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Générer</span>
              </button>

              {invitations.length > 0 && invitations[0].status === 'active' && (
                <button
                  type="button"
                  onClick={() =>
                    handleCopyCode(
                      `https://roadie.app/join?code=${invitations[0].code}`,
                    )
                  }
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  {copiedCode ===
                  `https://roadie.app/join?code=${invitations[0].code}` ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Copié !
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau d'historique */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="shrink-0 border-b border-slate-100 p-3.5 text-xs font-bold text-slate-900 dark:border-slate-800 dark:text-white">
          Historique des codes d'invitation
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:bg-slate-800">
              <tr>
                <th className="px-4 py-2.5">Code</th>
                <th className="px-4 py-2.5">Créé le</th>
                <th className="px-4 py-2.5">Expiration</th>
                <th className="px-4 py-2.5">Statut</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invitations.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white">
                    {item.code}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {item.createdAt}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {item.expiresAt}
                  </td>
                  <td className="px-4 py-2.5">
                    {item.status === 'active' && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Actif
                      </span>
                    )}
                    {item.status === 'used' && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        Utilisé ({item.usedBy})
                      </span>
                    )}
                    {item.status === 'expired' && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Expiré
                      </span>
                    )}
                  </td>
                  <td className="space-x-1.5 px-4 py-2.5 text-right">
                    {item.status === 'active' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            `https://roadie.app/join?code=${item.code}`,
                          )
                        }
                        className="p-1 text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        title="Copier le lien"
                      >
                        {copiedCode ===
                        `https://roadie.app/join?code=${item.code}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteInvitation(item.id)}
                      className="p-1 text-slate-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
