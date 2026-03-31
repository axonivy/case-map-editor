import type { StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { Badge, cn, Flex, IvyIcon, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDraggable } from '@dnd-kit/core';
import { DropZone } from './DropZone';
import { useSelectableTile } from './useSelectableTile';

export const ProcessTile = ({
  process,
  type,
  postId,
  dragging
}: {
  process: StageProcessModel;
  type: 'process' | 'sidestep';
  postId?: string;
  dragging?: boolean;
}) => {
  const readonly = useReadonly();
  const elementType = type === 'process' ? 'process' : 'sidestep';
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: process.id,
    data: { type: 'process' },
    disabled: readonly,
    attributes: { tabIndex: 0 }
  });
  const { onKeyDown, onDoubleClick, onClick, isSelected } = useSelectableTile(process.id, 'process');

  return (
    <DropZone id={process.id} postId={postId}>
      <Flex
        key={process.id}
        className={cn(
          'max-w-82.5 flex-1 rounded-md border border-n200 bg-background p-2 select-none hover:cursor-pointer hover:border-p300',
          dragging && 'cursor-grabbing bg-p50 opacity-50',
          isSelected && 'border-body'
        )}
        alignItems='center'
        justifyContent='space-between'
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        aria-label={process.name}
        data-element-type={elementType}
        data-selected={isSelected}
        data-dragging={dragging}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Flex alignItems='center' gap={1} className='overflow-hidden'>
          {!readonly && <IvyIcon icon={IvyIcons.EditDots} />}
          <div className='truncate'>{process.name}</div>
        </Flex>
        {process.preCondition !== undefined && (process.preCondition.label?.length > 0 || process.preCondition.script?.length > 0) && (
          <Badge round size='s' variant='primary'>
            <IvyIcon icon={IvyIcons.Condition} />
          </Badge>
        )}
      </Flex>
    </DropZone>
  );
};
