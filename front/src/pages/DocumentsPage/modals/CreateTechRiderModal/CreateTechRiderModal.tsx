import { Sliders, Layout, Zap, Bot } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { InfoModal } from '../../components/InfoModal';

interface CreateTechRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function CreateTechRiderModal({
  isOpen,
  onClose,
  onStart,
}: CreateTechRiderModalProps) {
  const { t } = useTranslation();

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      onStart={onStart}
      title={t('documentsPage.modals.techRider.title')}
      subtitle={t('documentsPage.modals.techRider.subtitle')}
      icon={<Sliders className="h-6 w-6" />}
      iconWrapperClassName="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
      subtitleClassName="text-blue-600 dark:text-blue-400"
      startLabel={t('documentsPage.modals.techRider.startLabel')}
      startBtnClassName="bg-blue-600 hover:bg-blue-700"
    >
      <p>
        <Trans
          i18nKey="documentsPage.modals.techRider.description"
          components={[
            <strong key="0" className="text-slate-900 dark:text-white" />
          ]}
        />
      </p>

      <div className="grid grid-cols-1 gap-2.5 pt-1">
        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.techRider.patchTitle')}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('documentsPage.modals.techRider.patchDesc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
          <Layout className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.techRider.stagePlanTitle')}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('documentsPage.modals.techRider.stagePlanDesc')}</p>
          </div>
        </div>
      </div>

      {/* Encart promotionnel Roadie */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
        <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">{t('documentsPage.modals.techRider.bannerTitle')}</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
            <Trans
              i18nKey="documentsPage.modals.techRider.bannerDesc"
              components={[
                <strong key="0" className="text-blue-600 dark:text-blue-400" />,
                <strong key="1" className="text-slate-900 dark:text-white" />,
              ]}
            />
          </p>
        </div>
      </div>
    </InfoModal>
  );
}
