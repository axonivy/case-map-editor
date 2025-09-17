import type { CaseMapModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';

type AddProcessDialogProps = {
  stageId: string;
  type: 'sidestep' | 'process';
  children: React.ReactNode;
};

export const AddProcessDialog = ({ stageId, type, children }: AddProcessDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
      <AddProcessDialogContent stageId={stageId} type={type} />
    </DialogContent>
  </Dialog>
);

const AddProcessDialogContent = ({ stageId, type }: { stageId: string; type: 'sidestep' | 'process' }) => {
  const { caseMap, setCaseMap } = useAppContext();
  const { t } = useTranslation();
  const [id, setId] = useState('newId');
  const [name, setName] = useState('newName');
  const [process, setProcess] = useState('someProcess');

  const idValidationMessage = useMemo(() => validateFieldId(id, caseMap), [id, caseMap]);
  const processValidationMessage = useMemo(() => validateFieldProcess(process), [process]);

  const addProcess = () => {
    const newProcess: StageProcessModel = {
      id: { id: id },
      name: name,
      processToExecute: { value: process },
      description: '',
      preCondition: { label: '', script: { script: '' } }
    };

    setCaseMap(old => {
      const newDataClass = structuredClone(old);
      const targetStage = newDataClass.stages.find(stage => stage.id.id === stageId);

      if (targetStage) {
        if (type === 'process') {
          targetStage.processes = targetStage.processes ?? [];
          targetStage.processes.push(newProcess);
        } else {
          targetStage.sideSteps = targetStage.sideSteps ?? [];
          targetStage.sideSteps.push(newProcess);
        }
      }

      return newDataClass;
    });
  };
  const allInputsValid = () => !idValidationMessage && !processValidationMessage;
  return (
    <BasicDialogContent
      title={t('dialog.addProcess.title')}
      description={t('dialog.addProcess.desc')}
      submit={
        <Button
          variant='primary'
          size='large'
          aria-label={t('dialog.addProcess.create')}
          onClick={addProcess}
          icon={IvyIcons.Plus}
          disabled={!allInputsValid()}
        >
          {t('dialog.addProcess.create')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large' onClick={e => e.stopPropagation()}>
          {t('common.label.cancel')}
        </Button>
      }
      tabIndex={-1}
    >
      <BasicField label={t('editor.sidebar.id')} message={idValidationMessage} tabIndex={0}>
        <BasicInput value={id} onChange={e => setId(e.target.value)} />
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
    caseMap.stages.some(stage => stage.id.id === id) ||
    caseMap.stages.some(stage => stage.processes?.some(process => process.id.id === id)) ||
    caseMap.stages.some(stage => stage.sideSteps?.some(sideSteps => sideSteps.id.id === id))
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
