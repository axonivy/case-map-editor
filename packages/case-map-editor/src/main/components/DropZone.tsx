import { cn } from '@axonivy/ui-components';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import type { ComponentProps } from 'react';
import './DropZone.css';

export type DropZoneProps = ComponentProps<'div'> & {
  id: string;
  postId?: string;
};

export const DropZone = ({ id, className, postId, children }: DropZoneProps) => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: dnd.active?.id === id || dnd.active?.id === postId || dnd.active?.data?.current?.type !== 'process'
  });

  return (
    <div ref={setNodeRef} className={cn('drop-zone', isOver && 'is-drop-target', className)}>
      {children}
      <div className='drop-zone-block' />
    </div>
  );
};

export const FirstStageDropZone = ({ id, className, postId, children, isFirst }: DropZoneProps & { isFirst: boolean }) => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({
    id: 'first-stage' + id,
    disabled: !isFirst || dnd.active?.id === id || dnd.active?.id === postId || dnd.active?.data?.current?.type !== 'stage'
  });

  return (
    <div ref={setNodeRef} className={cn('drop-zone-stage', isOver && 'is-drop-target', className)}>
      <div className='drop-zone-vertical-block' />
      {children}
    </div>
  );
};
