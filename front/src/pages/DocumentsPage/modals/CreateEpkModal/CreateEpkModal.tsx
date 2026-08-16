import { Sparkles, Globe, Music2, Share2, Bot } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { InfoModal } from '../../components/InfoModal';

interface CreateEpkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function CreateEpkModal({ isOpen, onClose, onStart }: CreateEpkModalProps) {
  const { t } = useTranslation();

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      onStart={onStart}
      title={t('documentsPage.modals.epk.title')}
      subtitle={t('documentsPage.modals.epk.subtitle')}
      icon={<Sparkles className="h-6 w-6" />}
      iconWrapperClassName="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
      subtitleClassName="text-purple-600 dark:text-purple-400"
      startLabel={t('documentsPage.modals.epk.startLabel')}
      startBtnClassName="bg-purple-600 hover:bg-purple-700"
    >
      <p>
        <Trans
          i18nKey="documentsPage.modals.epk.description"
          components={[
            <strong key="0" className="text-slate-900 dark:text-white" />
          ]}
        />
      </p>

      <div className="grid grid-cols-1 gap-2.5 pt-1">
        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Globe className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.epk.bioPhotosTitle')}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('documentsPage.modals.epk.bioPhotosDesc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Music2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.epk.audioClipsTitle')}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('documentsPage.modals.epk.audioClipsDesc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Share2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.epk.shareTitle')}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('documentsPage.modals.epk.shareDesc')}</p>
          </div>
        </div>
      </div>

      {/* Encart promotionnel Roadie */}
      <div className="flex items-start gap-3 rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5 dark:border-purple-900/50 dark:bg-purple-950/30">
        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.epk.bannerTitle')}</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
            <Trans
              i18nKey="documentsPage.modals.epk.bannerDesc"
              components={[
                <strong key="0" className="text-purple-600 dark:text-purple-400" />,
                <strong key="1" className="text-slate-900 dark:text-white" />,
              ]}
            />
          </p>
        </div>
      </div>
    </InfoModal>
  );
}
