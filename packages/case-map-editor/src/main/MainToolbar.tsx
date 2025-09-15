import { Button, Flex, Toolbar, ToolbarTitle, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

type MainToolbarProps = {
  title: string;
};

export const MainToolbar = ({ title }: MainToolbarProps) => {
  const { detail, setDetail } = useAppContext();
  const { t } = useTranslation();

  return (
    <Toolbar className='case-map-editor-main-toolbar'>
      <ToolbarTitle>{title}</ToolbarTitle>
      <Flex gap={1}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                icon={IvyIcons.LayoutSidebarRightCollapse}
                size='large'
                onClick={() => setDetail(!detail)}
                aria-label={t('editor.toolbar.detailToggle')}
              />
            </TooltipTrigger>
            <TooltipContent>{t('editor.toolbar.detailToggle')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Flex>
    </Toolbar>
  );
};
