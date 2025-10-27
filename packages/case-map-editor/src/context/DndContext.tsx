import {
  DndContext as DndKitContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';

import { useState, type ReactNode } from 'react';
import { ProcessTile } from '../main/components/ProcessTile';
import { StageTile } from '../main/components/StageTile';
import { useCaseMapData } from '../main/useCaseMapData';

export const DndContext = ({ children }: { children: ReactNode }) => {
  const [activeId, setActiveId] = useState<string | undefined>();
  const { moveElementAfter, findElementById } = useCaseMapData();
  const handleDragEnd = (event: DragEndEvent) => {
    const targetId = event.over?.id as string | undefined;
    if (targetId && activeId && event.active.data.current) {
      moveElementAfter(activeId, targetId, event.active.data.current.type);
    }
    setActiveId(undefined);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = `${event.active.id}`;
    setActiveId(activeId);
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
        ) : activeElement?.type === 'process' || activeElement?.type === 'sidestep' ? (
          <ProcessTile type={activeElement.type} process={activeElement.data} dragging={true} />
        ) : null}
      </DragOverlay>
    </DndKitContext>
  );
};
