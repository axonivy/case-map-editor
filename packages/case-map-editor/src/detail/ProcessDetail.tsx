import {
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Flex,
  PanelMessage
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useMeta } from '../context/useMeta';
import { useStageProcessProperty } from './useCaseMapProperty';

export const ProcessDetail = () => {
  const { t } = useTranslation();
  const { context, setSelectedElement } = useAppContext();
  const { process, setProperty } = useStageProcessProperty();
  const processes = useMeta('meta/processes', { projectFilter: context.pmv }, []).data.map(p => ({
    value: p.processReference,
    name: p.startName.length > 0 ? p.startName : p.processName,
    detail: p.userFriendlyRequestPath
  }));

  if (!process) {
    return <PanelMessage message={t('message.nothingSelected')} className='h-full flex-1' />;
  }
  return (
    <Flex direction='column' gap={2} className='overflow-auto'>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger> {t('editor.sidebar.general')}</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={2}>
            <BasicField label={t('editor.sidebar.id')} tabIndex={0}>
              <BasicInput
                value={process.id}
                onBlur={event => {
                  setProperty('id', event.target.value);
                  setSelectedElement({ id: event.target.value, type: 'stage' });
                }}
              />
            </BasicField>
            <BasicField label={t('editor.sidebar.name')} tabIndex={0}>
              <BasicInput value={process.name} onChange={event => setProperty('name', event.target.value)} />
            </BasicField>
            <BasicField label={t('editor.sidebar.description')} tabIndex={0}>
              <BasicInput value={process.description} onChange={event => setProperty('description', event.target.value)} />
            </BasicField>
            <BasicField label={t('editor.sidebar.process')} tabIndex={0}>
              <Combobox
                options={processes}
                value={process.processToExecute ?? ''}
                onChange={value => setProperty('processToExecute', value)}
                itemRender={option => <ExtendedComboboxProcess {...option} />}
              />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
      <PreConditionFields />
    </Flex>
  );
};

export const ExtendedComboboxProcess = ({ name, detail }: { name: string; detail: string }) => {
  return (
    <Flex direction='row' gap={1} className='flex-wrap items-start'>
      <span>{name}</span>
      <span className='text-n700'>- {detail}</span>
    </Flex>
  );
};

const PreConditionFields = () => {
  const { t } = useTranslation();
  const { process, setPropertyPreCondition } = useStageProcessProperty();
  if (!process) {
    return <>{t('message.nothingSelected')}</>;
  }
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger> {t('editor.sidebar.preCondition')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={2}>
          <BasicField label={t('editor.sidebar.label')} tabIndex={0}>
            <BasicInput value={process.preCondition?.label} onChange={event => setPropertyPreCondition('label', event.target.value)} />
          </BasicField>
          <BasicField label={t('editor.sidebar.condition')} tabIndex={0}>
            <BasicInput value={process.preCondition?.script} onChange={event => setPropertyPreCondition('script', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
