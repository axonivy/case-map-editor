import type { CaseMapModel, StageModel } from '@axonivy/case-map-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { modifyData } from '../../data/data';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';

type AddStageDialogProps = { children: React.ReactNode; index?: number };

const DIALOG_HOTKEY_IDS = ['addStageDialog'];

export const AddStageDialog = ({ children, index }: AddStageDialogProps) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addStage: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <AddStageDialogContent closeDialog={() => onOpenChange(false)} index={index} />
      </DialogContent>
    </Dialog>
  );
};

const AddStageDialogContent = ({ closeDialog, index }: { closeDialog: () => void; index?: number }) => {
  const { caseMap, setCaseMap } = useAppContext();
  const { t } = useTranslation();
  const [id, setId] = useState('newId');
  const [name, setName] = useState('newName');
  const [icon, setIcon] = useState('newIcon');
  const idInputRef = useRef<HTMLInputElement>(null);
  const idValidationMessage = useMemo(() => validateFieldId(id, caseMap), [id, caseMap]);
  const allInputsValid = () => !idValidationMessage;
  const addStage = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid()) {
      return;
    }
    const newStage: StageModel = {
      id: id,
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
      idInputRef.current?.focus();
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
      <BasicField label={t('editor.sidebar.id')} message={idValidationMessage} tabIndex={0}>
        <BasicInput ref={idInputRef} value={id} onChange={e => setId(e.target.value)} />
      </BasicField>
      <BasicField label={t('editor.sidebar.name')} tabIndex={0}>
        <BasicInput value={name} onChange={e => setName(e.target.value)} />
      </BasicField>
      <BasicField label={t('editor.sidebar.icon')} tabIndex={0}>
        <BasicInput value={icon} onChange={e => setIcon(e.target.value)} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const validateFieldId = (id: string, caseMap: CaseMapModel) => {
  if (id.trim() === '') {
    return toErrorMessage('Id cannot be empty.');
  }
  if (
    caseMap.stages?.some(stage => stage.id === id) ||
    caseMap.stages?.some(stage => stage.processes?.some(process => process.id === id)) ||
    caseMap.stages?.some(stage => stage.sidesteps?.some(sideSteps => sideSteps.id === id))
  ) {
    return toErrorMessage('Id is already taken.');
  }
  if (/\s/.test(id)) {
    return toErrorMessage('Id cannot have any whitespaces.');
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
