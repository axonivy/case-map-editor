import {
  BasicCheckbox,
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Flex,
  PanelMessage,
  type ComboboxOption
} from '@axonivy/ui-components';
import { useMemo } from 'react';
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
                value={stage.id.id}
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
            <BasicField label={t('editor.sidebar.icon')}>
              <IconCombobox value={stage.icon} onChange={value => setProperty('icon', value)} />
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

export const IconCombobox = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const icons = useMemo(() => extractStreamlineIcons(), []);
  const ExtendedComboboxItem = ({ value }: ComboboxOption) => (
    <Flex direction='row' alignItems='center' gap={2}>
      <i className={value} />
      <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{formatIconString(value)}</div>
    </Flex>
  );

  return (
    <Combobox
      value={value as string}
      onChange={onChange}
      options={icons.map(icon => {
        return { value: icon };
      })}
      itemRender={option => <ExtendedComboboxItem {...option} />}
    />
  );
};

const extractStreamlineIcons = (): string[] => {
  const iconDetails: string[] = [];

  const linkTag = Array.from(document.getElementsByTagName('link')).find(
    link => link.rel === 'stylesheet' && link.href.includes('/StreamlineIcons.css')
  );
  if (!linkTag) {
    console.warn(`Stylesheet not found`);
    return [];
  }

  for (let i = 0; i < document.styleSheets.length; i++) {
    const stylesheet = document.styleSheets[i];
    if (stylesheet?.href && stylesheet.href === linkTag.href) {
      try {
        const rules = stylesheet.cssRules || stylesheet.rules;
        if (rules) {
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText && rule.style.content) {
              const selector = rule.selectorText;
              if (selector.startsWith(`.si-`)) {
                const cleanSelector = selector.split('::')[0];
                iconDetails.push('si ' + cleanSelector?.slice(1));
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Error accessing stylesheet "/StreamlineIcons.css":`, e);
      }
    }
  }

  return iconDetails.sort();
};

const formatIconString = (icon: string) => {
  let formatted = icon.replace(/^(si[- ]?)+/, '');
  formatted = formatted.replace(/-/g, ' ');

  return formatted;
};
