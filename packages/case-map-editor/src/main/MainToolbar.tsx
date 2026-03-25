import {
  Button,
  Flex,
  Separator,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useRedoHotkey,
  useUndoHotkey
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';

type MainToolbarProps = {
  title: string;
};

export const MainToolbar = ({ title }: MainToolbarProps) => {
  const { detail, setDetail } = useAppContext();
  const firstElement = useRef<HTMLDivElement>(null);
  const readonly = useReadonly();
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      setTimeout(() => {
        document.querySelector<HTMLElement>('.ui-sidebar-header')?.focus();
      }, 0);
    },
    {
      scopes: ['global']
    }
  );
  useHotkeys(
    hotkeys.focusMain.hotkey,
    () => {
      document.querySelector<HTMLElement>('[aria-label^="Stage: "]')?.focus();
    },
    { scopes: ['global'] }
  );

  return (
    <Toolbar ref={firstElement} tabIndex={0}>
      <ToolbarTitle>{title}</ToolbarTitle>
      <Flex gap={1}>
        {!readonly && <EditButtons />}
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

const EditButtons = () => {
  const { history, setUnhistoriedVariables } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const undo = () => history.undo(setUnhistoriedVariables);
  const redo = () => history.redo(setUnhistoriedVariables);
  useUndoHotkey(undo, { scopes: ['global'] });
  useRedoHotkey(redo, { scopes: ['global'] });

  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Flex gap={1}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.undo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
              </TooltipTrigger>
              <TooltipContent>{hotkeys.redo.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Flex>
        <Separator orientation='vertical' className='mx-2! h-6.5!' />
      </Flex>
    </ToolbarContainer>
  );
};
