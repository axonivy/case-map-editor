import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, PanelMessage } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { usePreConditionProperty, useStageProcessProperty } from './useCaseMapProperty';

export const ProcessDetail = () => {
  const { t } = useTranslation();
  const { setSelectedElement } = useAppContext();
  const { process, setProperty } = useStageProcessProperty();
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
              <BasicInput value={process.processToExecute} onChange={event => setProperty('processToExecute', event.target.value)} />
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
  const { preCondition, setProperty } = usePreConditionProperty();
  if (!preCondition) {
    return <>{t('message.nothingSelected')}</>;
  }
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger> {t('editor.sidebar.preCondition')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={2}>
          <BasicField label={t('editor.sidebar.label')} tabIndex={0}>
            <BasicInput value={preCondition?.label} onChange={event => setProperty('label', event.target.value)} />
          </BasicField>
          <BasicField label={t('editor.sidebar.condition')} tabIndex={0}>
            <BasicInput value={preCondition?.script} onChange={event => setProperty('script', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
