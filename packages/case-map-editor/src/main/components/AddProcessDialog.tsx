import type { StageProcessModel } from '@axonivy/case-map-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicInput,
  BasicTooltip,
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogTrigger,
  useDialogHotkeys,
  useHotkeys,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../context/useMeta';
import { modifyData } from '../../data/data';
import { ExtendedComboboxProcess, type ExtendedComboboxOption } from '../../detail/ProcessDetail';
import { generateName, generateUniqueId } from '../../utils/formatting';

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
      <BasicTooltip content={t('dialog.addProcess.title', { type: type.charAt(0).toUpperCase() + type.slice(1) })}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </BasicTooltip>
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
  const { caseMap, setCaseMap, context } = useAppContext();
  const { t } = useTranslation();
  const processes = useMeta('meta/processes', { projectFilter: context.pmv }, []).data.map(p => ({
    value: p.processReference,
    name: p.startName.length > 0 ? p.startName : p.processName,
    detail: p.userFriendlyRequestPath
  }));

  const [name, setName] = useState('');
  const [process, setProcess] = useState('');
  const generatedId = useMemo(() => generateUniqueId(name, caseMap), [name, caseMap]);

  const nameValidationMessage = useMemo(() => validateField(name), [name]);
  const processValidationMessage = useMemo(() => validateField(process), [process]);

  const addProcess = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (!allInputsValid()) {
      return;
    }
    const newProcess: StageProcessModel = {
      id: generatedId,
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
    }
  };
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  const allInputsValid = () => !nameValidationMessage && !processValidationMessage;
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
      <BasicField label={t('editor.sidebar.process')} message={processValidationMessage}>
        <Combobox
          options={processes}
          value={process}
          onChange={value => {
            setProcess(value);
            setName(generateName(value, processes));
          }}
          optionFilter={extendedOptionFilter}
          itemRender={option => <ExtendedComboboxProcess {...option} />}
        />
      </BasicField>

      <BasicField label={t('editor.sidebar.name')} message={process ? nameValidationMessage : undefined} tabIndex={0}>
        <BasicInput value={name} onChange={e => setName(e.target.value)} disabled={!process} />
      </BasicField>
    </BasicDialogContent>
  );
};

export const extendedOptionFilter = ({ name, detail }: ExtendedComboboxOption, input?: string) => {
  if (!input) {
    return true;
  }
  const filterIncludes = (value?: string) => (value ? value.toLocaleLowerCase().includes(input.toLowerCase()) : false);
  return filterIncludes(name) || filterIncludes(detail);
};

export const validateField = (name: string) => {
  if (name.trim() === '') {
    return toErrorMessage('Field cannot be empty.');
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
