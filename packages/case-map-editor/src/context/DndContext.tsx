import {
  DndContext as DndKitContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';

import type { CreateProcessData } from '@axonivy/case-map-editor-protocol';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { ProcessTile } from '../main/components/ProcessTile';
import { StageTile } from '../main/components/StageTile';
import { PALETTE_ITEM_PREFIX } from '../main/palette/Palette';
import { useCaseMapData } from '../main/useCaseMapData';

export const isCreateProcessData = (data: unknown): data is CreateProcessData =>
  typeof data === 'object' && data !== null && 'name' in data && 'processToExecute' in data;

export const DndContext = ({ children }: { children: ReactNode }) => {
  const { findElementById, createFromPalette, moveElementDrop } = useCaseMapData();
  const [activeId, setActiveId] = useState<string | undefined>();
  const [createData, setCreateData] = useState<CreateProcessData | undefined>();
  const handleDragEnd = (event: DragEndEvent) => {
    const targetId = event.over?.id as string | undefined;
    const activeType = event.active.data.current?.type;
    const overType = event.over?.data.current?.type;

    if (!targetId || !activeId) {
      resetDragState();
      return;
    }
    const fromPalette = activeId?.startsWith(PALETTE_ITEM_PREFIX);
    if (fromPalette && createData) {
      createFromPalette(targetId, createData, overType);
    } else if (activeType) {
      moveElementDrop(activeId, targetId, activeType, overType);
    }
    resetDragState();
  };

  const resetDragState = () => {
    setActiveId(undefined);
    setCreateData(undefined);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = `${event.active.id}`;
    const createData = event.active.data?.current;
    setActiveId(activeId);
    setCreateData(isCreateProcessData(createData) ? createData : undefined);
  };

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);
  const activeElement = findElementById(activeId ?? '');
  return (
    <DndKitContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
      {children}
      <DragOverlay dropAnimation={null}>
        {activeElement?.type === 'stage' ? (
          <StageTile stage={activeElement.data} dragging={true} />
        ) : activeId?.startsWith(PALETTE_ITEM_PREFIX) ? (
          <OverlayProcessTile name={createData?.name ?? ''} />
        ) : activeElement?.type === 'process' || activeElement?.type === 'sidestep' ? (
          <ProcessTile type={activeElement.type} process={activeElement.data} dragging={true} />
        ) : null}
      </DragOverlay>
    </DndKitContext>
  );
};

export const OverlayProcessTile = ({ name }: { name: string }) => {
  return (
    <Flex
      key={name}
      className='inline-flex max-w-82.5 min-w-50 cursor-grabbing rounded-md border border-n200 bg-p50 p-2 opacity-50 select-none hover:cursor-pointer hover:border-p300'
      alignItems='center'
      justifyContent='space-between'
      aria-label={name}
      data-dragging={true}
    >
      <Flex alignItems='center' gap={1} className='overflow-hidden'>
        <IvyIcon icon={IvyIcons.EditDots} />
        <div className='truncate'>{name}</div>
      </Flex>
    </Flex>
  );
};
