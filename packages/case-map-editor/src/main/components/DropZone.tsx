import { cn } from '@axonivy/ui-components';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import type { ComponentProps } from 'react';

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
    <div ref={setNodeRef} className={cn('flex min-w-auto flex-col', className)}>
      {children}
      <div className={cn('h-0 transition-[height] duration-100 ease-out', isOver && 'h-1 bg-p300')} />
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
    <div ref={setNodeRef} className={cn('flex min-w-auto flex-row', className)}>
      <div className={cn('w-0 transition-[width] duration-100 ease-out', isOver && 'mr-2 h-full w-0.5 bg-p300')} />
      {children}
    </div>
  );
};
