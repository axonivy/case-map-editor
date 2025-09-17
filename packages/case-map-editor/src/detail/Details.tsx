import { Button, Flex, SidebarHeader, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './Details.css';
import { EmptyDetail } from './EmptyDetail';
import { ProcessDetail } from './ProcessDetail';
import { StageDetail } from './StageDetail';

export const Detail = () => {
  const { selectedElement } = useAppContext();
  const { t } = useTranslation();
  return (
    <Flex direction='column' className='case-map-editor-detail-panel'>
      <SidebarHeader icon={IvyIcons.PenEdit} title={selectedElement?.id ?? ''} className='case-map-editor-detail-header'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} />
            </TooltipTrigger>
            <TooltipContent>{t('message.help')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <Flex direction='column' className='case-map-editor-detail-content'>
        {selectedElement?.type === 'stage' ? <StageDetail /> : selectedElement?.type === 'process' ? <ProcessDetail /> : <EmptyDetail />}
      </Flex>
    </Flex>
  );
};
