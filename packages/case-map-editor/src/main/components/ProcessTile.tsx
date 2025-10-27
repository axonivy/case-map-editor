import type { StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDraggable } from '@dnd-kit/core';
import { DropZone } from './DropZone';
import './ProcessTile.css';
import { useSelectableTile } from './useSelectableTile';

export const ProcessTile = ({ process, type, postId }: { process: StageProcessModel; type: 'process' | 'sidestep'; postId?: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: process.id.id,
    data: { type: 'process' },
    attributes: { tabIndex: 0 }
  });
  const { onKeyDown, onDoubleClick, onClick, isSelected } = useSelectableTile(process.id.id, 'process');

  return (
    <DropZone id={process.id.id} postId={postId}>
      <Flex
        key={process.id.id}
        className={`${type}-tile ${isSelected ? 'selected' : ''}`}
        alignItems='center'
        justifyContent='space-between'
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Flex alignItems='center' gap={1} style={{ overflow: 'hidden' }}>
          <IvyIcon icon={IvyIcons.EditDots} />
          <div className='process-tile-name'> {process.name}</div>
        </Flex>
        {process.preCondition !== undefined && process.preCondition.label.length > 0 && process.preCondition.script.script.length > 0 && (
          <IvyIcon className='process-tile-condition-badge' icon={IvyIcons.Condition} />
        )}
      </Flex>
    </DropZone>
  );
};
