import {
  BasicCheckbox,
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  PanelMessage
} from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useStageProperty } from './useCaseMapProperty';

export const StageDetail = () => {
  const { t } = useTranslation();
  const { setSelectedElement } = useAppContext();
  const { stage, setProperty, setPropertyId } = useStageProperty();
  if (!stage) {
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
                value={stage.id.value}
                onBlur={event => {
                  setPropertyId(event.target.value);
                  setSelectedElement({ id: event.target.value, type: 'stage' });
                }}
              />
            </BasicField>
            <BasicField label={t('editor.sidebar.name')} tabIndex={0}>
              <BasicInput value={stage.name} onChange={event => setProperty('name', event.target.value)} />
            </BasicField>
            <BasicField label={t('editor.sidebar.description')} tabIndex={0}>
              <BasicInput value={stage.description} onChange={event => setProperty('description', event.target.value)} />
            </BasicField>
            <BasicField label={t('editor.sidebar.icon')} tabIndex={0}>
              <BasicInput value={stage.icon} onChange={event => setProperty('icon', event.target.value)} />
            </BasicField>
            <BasicCheckbox
              label={t('editor.sidebar.isTerminating')}
              checked={stage.isTerminating ?? false}
              onCheckedChange={checked => setProperty('isTerminating', checked === true)}
            />
          </Flex>
        </CollapsibleContent>
      </Collapsible>
    </Flex>
  );
};
