import type { CaseMap, Stage } from '@axonivy/case-map-editor-protocol';
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

type AddStageDialogProps = { children: React.ReactNode; index?: number };

export const AddStageDialog = ({ children, index }: AddStageDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <AddStageDialogContent index={index} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AddStageDialogContent = ({ index, closeDialog }: { closeDialog: () => void; index?: number }) => {
  const { caseMap, setCaseMap } = useAppContext();
  const { t } = useTranslation();

  const [id, setId] = useState('newId');
  const [name, setName] = useState('newName');
  const [icon, setIcon] = useState('newIcon');

  const idValidationMessage = useMemo(() => validateFieldId(id, caseMap), [id, caseMap]);

  const addStage = () => {
    const newField: Stage = {
      id: id,
      name: name,
      icon: icon,
      description: '',
      processes: [],
      sidesteps: []
    };

    setCaseMap(old => {
      const newDataClass = structuredClone(old);
      const insertIndex = Math.max(0, Math.min(index ?? caseMap.stages.length - 1, newDataClass.stages.length));
      newDataClass.stages.splice(insertIndex, 0, newField);
      return newDataClass;
    });

    closeDialog();
  };
  const allInputsValid = () => !idValidationMessage;
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
      tabIndex={-1}
    >
      <BasicField label={t('editor.sidebar.id')} message={idValidationMessage} tabIndex={0}>
        <BasicInput value={id} onChange={e => setId(e.target.value)} />
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

export const validateFieldId = (id: string, caseMap: CaseMap) => {
  if (id.trim() === '') {
    return toErrorMessage('Id cannot be empty.');
  }
  if (
    caseMap.stages.some(stage => stage.id === id) ||
    caseMap.stages.some(stage => stage.processes?.some(process => process.id === id)) ||
    caseMap.stages.some(stage => stage.sidesteps?.some(sidesteps => sidesteps.id === id))
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
