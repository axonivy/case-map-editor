import { PanelMessage } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const EmptyDetail = () => {
  const { t } = useTranslation();
  return <PanelMessage message={t('message.nothingSelected')} style={{ height: '100%', flex: 1 }} />;
};
