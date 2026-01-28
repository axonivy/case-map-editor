import { Button, Flex, SidebarHeader, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useAction } from '../hooks/useAction';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import './Details.css';
import { EmptyDetail } from './EmptyDetail';
import { ProcessDetail } from './ProcessDetail';
import { StageDetail } from './StageDetail';

export const Detail = () => {
  const { selectedElement, helpUrl } = useAppContext();
  const openUrl = useAction('openUrl');
  const { t } = useTranslation();
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  return (
    <>
      <SidebarHeader icon={IvyIcons.PenEdit} title={selectedElement?.id ?? ''} className='case-map-editor-detail-header' tabIndex={0}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
            </TooltipTrigger>
            <TooltipContent>{t('message.help')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <Flex direction='column' className='case-map-editor-detail-content'>
        {selectedElement?.type === 'stage' ? <StageDetail /> : selectedElement?.type === 'process' ? <ProcessDetail /> : <EmptyDetail />}
      </Flex>
    </>
  );
};
