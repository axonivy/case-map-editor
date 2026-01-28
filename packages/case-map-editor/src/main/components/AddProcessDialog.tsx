import type { CaseMapModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
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

type AddProcessDialogProps = {
  stageId: string;
  type: 'sidestep' | 'process';
  children: React.ReactNode;
};

const DIALOG_HOTKEY_IDS = ['addProcessDialog'];

export const AddProcessDialog = ({ stageId, type, children }: AddProcessDialogProps) => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('dialog.addProcess.title', { type: type.charAt(0).toUpperCase() + type.slice(1) })}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <AddProcessDialogContent stageId={stageId} type={type} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AddProcessDialogContent = ({
  stageId,
  type,
  closeDialog
}: {
  stageId: string;
  type: 'sidestep' | 'process';
  closeDialog: () => void;
}) => {
  const { caseMap, setCaseMap } = useAppContext();
  const { t } = useTranslation();
  const [id, setId] = useState('newId');
  const [name, setName] = useState('newName');
  const [process, setProcess] = useState('someProcess');
  const idInputRef = useRef<HTMLInputElement>(null);
  const idValidationMessage = useMemo(() => validateFieldId(id, caseMap), [id, caseMap]);
  const processValidationMessage = useMemo(() => validateFieldProcess(process), [process]);

  const addProcess = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid()) {
      return;
    }
    const newProcess: StageProcessModel = {
      id: id,
      name: name,
      processToExecute: process,
      description: '',
      preCondition: { label: '', script: '' }
    };

    setCaseMap(
      old =>
        modifyData(old, {
          type: 'add',
          data: { parentId: stageId, type: type, newElement: newProcess }
        }).newData
    );
    if (!event.ctrlKey && !event.metaKey) {
      closeDialog();
    } else {
      setName('');
      idInputRef.current?.focus();
    }
  };
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  const allInputsValid = () => !idValidationMessage && !processValidationMessage;
  const enter = useHotkeys<HTMLDivElement>(['Enter', 'mod+Enter'], addProcess, { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true });

  return (
    <BasicDialogContent
      title={t('dialog.addProcess.title', { type: formattedType })}
      description={t('dialog.addProcess.desc', { type: formattedType })}
      submit={
        <Button
          variant='primary'
          size='large'
          aria-label={t('dialog.addProcess.create', { type: formattedType })}
          onClick={addProcess}
          icon={IvyIcons.Plus}
          disabled={!allInputsValid()}
        >
          {t('dialog.addProcess.create', { type: formattedType })}
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
      <BasicField label={t('editor.sidebar.process')} message={processValidationMessage} tabIndex={0}>
        <BasicInput value={process} onChange={e => setProcess(e.target.value)} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const validateFieldId = (id: string, caseMap: CaseMapModel) => {
  if (id.trim() === '') {
    return toErrorMessage('Id cannot be empty.');
  }
  if (
    caseMap.stages.some(stage => stage.id === id) ||
    caseMap.stages.some(stage => stage.processes?.some(process => process.id === id)) ||
    caseMap.stages.some(stage => stage.sidesteps?.some(sideSteps => sideSteps.id === id))
  ) {
    return toErrorMessage('Id is already taken.');
  }
  if (/\s/.test(id)) {
    return toErrorMessage('Id cannot have any whitespaces.');
  }
  return;
};

export const validateFieldProcess = (id: string) => {
  if (id.trim() === '') {
    return toErrorMessage('Process cannot be empty.');
  }

  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
