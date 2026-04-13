import {
  BasicTooltip,
  Button,
  Flex,
  Separator,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
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
import { PalettePopover, ProcessPalette } from './palette/Palette';

type MainToolbarProps = {
  title: string;
};

export const MainToolbar = ({ title }: MainToolbarProps) => {
  const { detail, setDetail } = useAppContext();
  const firstElementRef = useRef<HTMLDivElement>(null);
  const readonly = useReadonly();
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });
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
      document.querySelector<HTMLElement>('[data-element-type="stage"]')?.focus();
    },
    { scopes: ['global'] }
  );

  return (
    <Toolbar ref={firstElementRef} tabIndex={0}>
      <ToolbarTitle>{title}</ToolbarTitle>
      <PalettePopover label={t('editor.flow.processes')} icon={IvyIcons.Process}>
        <ProcessPalette />
      </PalettePopover>
      <Flex gap={1}>
        {!readonly && <EditButtons />}

        <BasicTooltip content={t('editor.toolbar.detailToggle')}>
          <Button
            icon={IvyIcons.LayoutSidebarRightCollapse}
            size='large'
            onClick={() => setDetail(!detail)}
            aria-label={t('editor.toolbar.detailToggle')}
          />
        </BasicTooltip>
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
          <BasicTooltip content={hotkeys.undo.label}>
            <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
          </BasicTooltip>
          <BasicTooltip content={hotkeys.redo.label}>
            <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
          </BasicTooltip>
        </Flex>
        <Separator orientation='vertical' className='mx-2! h-6.5!' />
      </Flex>
    </ToolbarContainer>
  );
};
