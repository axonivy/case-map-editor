import type { Stage, StageProcess } from '@axonivy/case-map-editor-protocol';
import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { findElementById } from '../data/data-utils';

export const Sidebar = () => {
  const { t } = useTranslation();
  const { caseMap, selectedElement } = useAppContext();
  const element = findElementById(caseMap, selectedElement);

  const renderProperties = (obj: Stage | StageProcess) => {
    return (Object.keys(obj) as (keyof typeof obj)[]).map(key => {
      const value = obj[key];
      return (
        <BasicField key={String(key)} label={String(key)} className='badge-field' tabIndex={0}>
          <BasicInput value={formatValue(value)} onChange={() => {}} />
        </BasicField>
      );
    });
  };

  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.length === 0 ? '[]' : JSON.stringify(value, null, 2);
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <Flex direction='column' className='case-map-editor-detail-panel'>
      <SidebarHeader icon={IvyIcons.PenEdit} title={selectedElement ?? ''} />
      <Flex className='properties' direction='column' gap={2}>
        {element ? (
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger> {t('editor.sidebar.general')}</CollapsibleTrigger>
            <CollapsibleContent>
              {' '}
              <Flex direction='column' gap={2}>
                {renderProperties(element)}
              </Flex>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div> {t('editor.sidebar.noElement')}</div>
        )}
      </Flex>
    </Flex>
  );
};
