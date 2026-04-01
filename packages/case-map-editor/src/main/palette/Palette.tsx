import type { CreateProcessData, ProcessStart } from '@axonivy/case-map-editor-protocol';
import {
  cn,
  Flex,
  groupBy,
  IvyIcon,
  Palette,
  PaletteButton,
  PaletteButtonLabel,
  PaletteSection,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useReadonly,
  type PaletteItemConfig,
  type PaletteItemProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../context/useMeta';

export const PALETTE_ITEM_PREFIX = 'palette-item-';

type PalettePopoverProps = {
  label: string;
  icon: IvyIcons;
  children: ReactNode;
};

export const PalettePopover = ({ label, icon, children }: PalettePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { active } = useDndContext();

  useEffect(() => {
    if (active !== undefined && active !== null && popoverOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPopoverOpen(false);
    }
  }, [active, popoverOpen]);

  return (
    <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
      <PaletteButtonLabel label={label}>
        <PopoverTrigger asChild>
          <PaletteButton label={label} icon={icon} />
        </PopoverTrigger>
      </PaletteButtonLabel>
      <PopoverContent sideOffset={7} hideWhenDetached={true} onClick={e => e.stopPropagation()}>
        {children}
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};

export const ProcessPalette = () => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const processes = useMeta('meta/processes', { projectFilter: context.pmv }, []).data;
  const sections = useMemo(() => processPaletteSections(processes), [processes]);

  const searchFilter = (item: ProcessPaletteItemConfig, term: string) =>
    item.displayName.toLocaleLowerCase().includes(term.toLocaleLowerCase());

  return (
    <Palette
      sections={sections}
      options={{ searchPlaceholder: t('common.label.search'), searchFilter, emptyMessage: t('message.emptyPalette') }}
    >
      {(title, items) => (
        <PaletteSection key={title} title={title ?? ''} items={items}>
          {item => <ProcessPaletteItem key={item.name} {...item} />}
        </PaletteSection>
      )}
    </Palette>
  );
};

type ProcessPaletteItemConfig = Omit<PaletteItemConfig, 'icon'> & {
  displayName: string;
  data: CreateProcessData;
};

const ProcessPaletteItem = ({ displayName, data, classNames, name, description }: PaletteItemProps<ProcessPaletteItemConfig>) => {
  const readonly = useReadonly();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: PALETTE_ITEM_PREFIX + name,
    data,
    disabled: readonly,
    attributes: { tabIndex: 0 }
  });

  return (
    <button
      className={cn(classNames.paletteItem, 'ui-palette-item w-20')}
      title={description}
      style={{ cursor: 'grab' }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <Flex direction='column' gap={1} alignItems='center'>
        <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
          <IvyIcon icon={IvyIcons.Process} />
        </Flex>
        <Flex justifyContent='center' className='w-full truncate'>
          {displayName}
        </Flex>
      </Flex>
    </button>
  );
};

const toSectionTitle = (process: ProcessStart): string => {
  const path = process.userFriendlyRequestPath ?? '';
  const packagePath = path.includes('/') ? path.split('/').slice(0, -2).join('/') : path;
  return packagePath || path || 'Processes';
};

const toConfig = (process: ProcessStart): ProcessPaletteItemConfig => ({
  name: process.processReference,
  displayName: process.startName.length > 0 ? process.startName : process.processName,
  description: process.userFriendlyRequestPath,
  data: {
    name: process.startName.length > 0 ? process.startName : process.processName,
    processToExecute: process.processReference
  }
});

const processPaletteSections = (processes: ProcessStart[]): Record<string, ProcessPaletteItemConfig[]> => {
  const grouped = groupBy(processes, toSectionTitle);
  return Object.fromEntries(Object.entries(grouped).map(([title, procs]) => [title, procs.map(toConfig)]));
};
