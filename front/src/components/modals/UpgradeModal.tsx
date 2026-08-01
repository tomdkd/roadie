import { useState } from 'react';
import { X, Check, Sparkles, Zap, Crown, Gift } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'ultimate'>('ultimate');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      icon: Zap,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      features: [
        '1 projet',
        '1 Go de stockage',
        '3 versions max. pour l’EPK',
        '3 versions max. pour la fiche technique',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '9,99€',
      period: '/mois',
      icon: Sparkles,
      popular: true,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      features: [
        '3 projets',
        '10 Go de stockage',
        'Messagerie en temps réel 💬',
        '10 versions max. pour l’EPK',
        '10 versions max. pour la fiche technique',
      ],
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '15,99€',
      period: '/mois',
      icon: Crown,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      features: [
        'Projets illimités',
        '100 Go de stockage',
        'Messagerie en temps réel 💬',
        'EPK & Fiches techniques illimités',
        'Synchro auto MusicBrainz 🧠',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-start sm:items-center">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Conteneur Modal avec Scroll sur mobile */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 my-auto">
        
        {/* Halos décoratifs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Bouton Fermer Sticky */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right z-10 rounded-full bg-white/80 dark:bg-slate-900/80 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* En-tête */}
        <div className="text-center max-w-lg mx-auto clear-both pt-2 sm:pt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" /> Offres & Abonnements
          </span>
          <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Passez au niveau supérieur
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Débloquez des fonctionnalités avancées pour piloter vos projets musicaux comme des pros.
          </p>
        </div>

        {/* 🎁 Encart Spécial Early-Adopters / Alpha (REPOSITIONNÉ EN HAUT) */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-purple-900 dark:text-purple-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white shadow-sm">
            <Gift className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-purple-900 dark:text-purple-100">
              Merci de faire partie des pionniers ! 🚀
            </p>
            <p className="text-purple-700 dark:text-purple-300/80 leading-relaxed mt-0.5">
              Roadie est actuellement en version **Alpha**. En ayant reçu un accès anticipé, votre compte bénéficie de l'accès **Ultimate à vie (0€/mois)** pour vous remercier de nous aider à construire la plateforme.
            </p>
          </div>
        </div>

        {/* Cartes des Plans */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                  plan.popular
                    ? 'border-amber-500 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 shadow-lg shadow-amber-500/5'
                    : isSelected
                    ? 'border-blue-500 bg-slate-50 dark:border-blue-500 dark:bg-slate-800/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}
              >
                {/* Badge Populaire */}
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                    Recommandé
                  </span>
                )}

                <div>
                  {/* Titre & Icône */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${plan.badgeColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mt-4 flex items-baseline gap-0.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {plan.period}
                    </span>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <ul className="mt-5 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton d'action */}
                <button
                  type="button"
                  className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md hover:opacity-95'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {plan.price === '0€' ? 'Plan Actuel' : `Choisir ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}