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
  const { setSelectedElement } = useAppContext();
  const { process, setProperty, setPropertyId, setPropertyProcessToExecute } = useStageProcessProperty();
  const processes = useMeta('meta/processes', { projectFilter: '' }, []).data.map(p => ({ value: p.name }));

  if (!process) {
    return <PanelMessage message={t('message.nothingSelected')} style={{ height: '100%', flex: 1 }} />;
  }
  return (
    <Flex direction='column' gap={2} style={{ overflow: 'auto' }}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger> {t('editor.sidebar.general')}</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={2}>
            <BasicField label={t('editor.sidebar.id')} tabIndex={0}>
              <BasicInput
                value={process.id.id}
                onBlur={event => {
                  setPropertyId(event.target.value);
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
                value={process.processToExecute?.value ?? ''}
                onChange={value => setPropertyProcessToExecute(value)}
              />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
      <PreConditionFields />
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
            <BasicInput value={process.preCondition.label} onChange={event => setPropertyPreCondition('label', event.target.value)} />
          </BasicField>
          <BasicField label={t('editor.sidebar.condition')} tabIndex={0}>
            <BasicInput
              value={process.preCondition.script.script}
              onChange={event => setPropertyPreCondition('script', { script: event.target.value })}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
