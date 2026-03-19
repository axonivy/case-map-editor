import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useCaseMapProperty } from './useCaseMapProperty';

export const CaseMapDetail = () => {
  const { t } = useTranslation();
  const { caseMap, setProperty } = useCaseMapProperty();
  return (
    <Flex direction='column' gap={2} style={{ overflow: 'auto' }}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger> {t('editor.sidebar.general')}</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={2}>
            <BasicField label={t('editor.sidebar.id')} tabIndex={0}>
              <BasicInput
                value={caseMap.id}
                onBlur={event => {
                  setProperty('id', event.target.value);
                }}
              />
            </BasicField>
            <BasicField label={t('editor.sidebar.name')} tabIndex={0}>
              <BasicInput value={caseMap.name} onChange={event => setProperty('name', event.target.value)} />
            </BasicField>
            <BasicField label={t('editor.sidebar.description')} tabIndex={0}>
              <BasicInput value={caseMap.description} onChange={event => setProperty('description', event.target.value)} />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
    </Flex>
  );
};
