import { Combobox, Flex, type ComboboxOption } from '@axonivy/ui-components';
import { useMemo } from 'react';
import './IconCombobox.css';

export const IconCombobox = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const icons = useMemo(() => extractIcons(), []);
  const iconOptions = icons.map(icon => ({ value: icon }));
  return (
    <Flex alignItems='center' gap={2} className='stage-icon-combobox'>
      <i className={removeCSSPrefix(value) + ' stage-icon-preview'} />
      <Combobox
        value={value as string}
        onChange={onChange}
        options={iconOptions}
        optionsLimit={50}
        optionFilter={(option, input) =>
          formatIconString(option.value)
            .toLowerCase()
            .startsWith(input?.toLowerCase() || '')
        }
        itemRender={option => <ExtendedComboboxItem {...option} />}
      />
    </Flex>
  );
};

const ExtendedComboboxItem = ({ value }: ComboboxOption) => (
  <Flex direction='row' alignItems='center' gap={2}>
    <i className={removeCSSPrefix(value)} />
    <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{formatIconString(value)}</div>
  </Flex>
);

export const removeCSSPrefix = (icon: string) => {
  return icon.replace(/^css:/, '');
};

const formatIconString = (icon: string) => {
  let formatted = icon.replace(/^(ti[- ]?)+/, '');
  formatted = formatted.replace(/-/g, ' ');
  return formatted;
};

const extractIcons = (): string[] => {
  const iconDetails: string[] = [];

  const linkTag = Array.from(document.getElementsByTagName('link')).find(
    link => link.rel === 'stylesheet' && link.href.includes('/tabler-icons.min.css')
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
              if (selector.startsWith(`.ti-`)) {
                const cleanSelector = selector.split('::')[0];
                if (cleanSelector) {
                  iconDetails.push('ti ' + cleanSelector.slice(1));
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Error accessing stylesheet "/tabler-icons.min.css":`, e);
      }
    }
  }

  return iconDetails.sort();
};
