import type { StageModel } from '@axonivy/case-map-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicInput,
  BasicTooltip,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { modifyData } from '../../data/data';
import { IconCombobox } from '../../detail/IconCombobox';
import { generateUniqueId } from '../../utils/formatting';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';

type AddStageDialogProps = { children: React.ReactNode; index?: number };

const DIALOG_HOTKEY_IDS = ['addStageDialog'];

export const AddStageDialog = ({ children, index }: AddStageDialogProps) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addStage: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BasicTooltip content={shortcut.label}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </BasicTooltip>
      <DialogContent>
        <AddStageDialogContent closeDialog={() => onOpenChange(false)} index={index} />
      </DialogContent>
    </Dialog>
  );
};

const AddStageDialogContent = ({ closeDialog, index }: { closeDialog: () => void; index?: number }) => {
  const { caseMap, setCaseMap } = useAppContext();
  const { t } = useTranslation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('newName');
  const [icon, setIcon] = useState('ti ti-check');
  const generatedId = useMemo(() => generateUniqueId(name, caseMap), [name, caseMap]);

  const nameValidationMessage = useMemo(() => validateFieldName(name), [name]);
  const allInputsValid = () => !nameValidationMessage;
  const addStage = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid()) {
      return;
    }
    const newStage: StageModel = {
      id: generatedId,
      name: name,
      icon: icon,
      isTerminating: false,
      description: '',
      processes: [],
      sidesteps: []
    };

    setCaseMap(old => {
      const stages = old.stages ?? [];
      const afterId = stages[index ? index - 1 : stages.length - 1]?.id;
      return modifyData(old, { type: 'add', data: { newElement: newStage, type: 'stage', targetId: afterId } }).newData;
    });
    if (!event.ctrlKey && !event.metaKey) {
      closeDialog();
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
  };
  const enter = useHotkeys<HTMLDivElement>(['Enter', 'mod+Enter'], addStage, { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true });

  return (
    <BasicDialogContent
      title={t('dialog.addStage.title')}
      description={t('dialog.addStage.desc')}
      submit={
        <Button
          variant='primary'
          size='large'
          aria-label={t('dialog.addStage.create')}
          onClick={addStage}
          icon={IvyIcons.Plus}
          disabled={!allInputsValid()}
        >
          {t('dialog.addStage.create')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large' onClick={e => e.stopPropagation()}>
          {t('common.label.cancel')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('editor.sidebar.name')} message={nameValidationMessage}>
        <BasicInput ref={nameInputRef} value={name} onChange={e => setName(e.target.value)} />
      </BasicField>
      <BasicField label={t('editor.sidebar.icon')}>
        <IconCombobox value={icon} onChange={value => setIcon(value)} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const validateFieldName = (name: string) => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
