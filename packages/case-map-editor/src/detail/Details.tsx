import { BasicTooltip, Button, Flex, SidebarHeader, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../hooks/useAction';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import { CaseMapDetail } from './CaseMapDetail';
import { ProcessDetail } from './ProcessDetail';
import { StageDetail } from './StageDetail';

export const Detail = () => {
  const { selectedElement, helpUrl, caseMap } = useAppContext();
  const openUrl = useAction('openUrl');
  const { t } = useTranslation();
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  return (
    <>
      <SidebarHeader icon={IvyIcons.PenEdit} title={selectedElement?.id ?? caseMap.name} tabIndex={0}>
        <BasicTooltip content={t('message.help')}>
          <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
        </BasicTooltip>
      </SidebarHeader>
      <Flex direction='column' className='flex-1 p-2'>
        {selectedElement?.type === 'stage' ? <StageDetail /> : selectedElement?.type === 'process' ? <ProcessDetail /> : <CaseMapDetail />}
      </Flex>
    </>
  );
};
