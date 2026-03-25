import type { StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import {
  Button,
  cn,
  Flex,
  IvyIcon,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import type { ElementType } from '../../data/data';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { useCaseMapData } from '../useCaseMapData';
import { AddProcessDialog } from './AddProcessDialog';
import { DropZone, FirstStageDropZone } from './DropZone';
import { ProcessTile } from './ProcessTile';
import { useSelectableTile } from './useSelectableTile';

export const StageTile = ({ stage, dragging }: { stage: StageModel; dragging?: boolean }) => {
  const { t } = useTranslation();
  const { caseMap } = useAppContext();
  const readonly = useReadonly();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: stage.id,
    data: { type: 'stage' },
    disabled: readonly,
    attributes: { tabIndex: 0 }
  });
  const isFirst = caseMap.stages[0]?.id === stage.id;
  const { onKeyDown, onDoubleClick, onClick, isSelected } = useSelectableTile(stage.id, 'stage');

  return (
    <FirstStageDropZone isFirst={isFirst} id={stage.id}>
      <Flex
        className={cn(
          'min-w-50 flex-wrap rounded-lg border border-transparent bg-background p-3 select-none hover:cursor-pointer hover:border-p300',
          dragging && 'cursor-grabbing bg-p50 opacity-50',
          isSelected && 'border-body'
        )}
        direction='column'
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        aria-label={stage.name}
        data-element-type='stage'
        data-selected={isSelected}
        data-dragging={dragging}
        gap={3}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Flex className='h-5 max-w-87.5 overflow-hidden font-bold text-body' alignItems='center' justifyContent='space-between' gap={2}>
          <Flex gap={2} alignItems='center' className='truncate'>
            {stage.name}
          </Flex>
          {!readonly && <DeleteButton id={stage.id} type='stage' />}
        </Flex>
        <Separator className='mbs-0! mbe-0!' />
        <Flex direction='column' gap={3}>
          <ProcessPart stageId={stage.id} title={t('editor.flow.processes')} stageProcesses={stage.processes} type='process' />
          <ProcessPart stageId={stage.id} title={t('editor.flow.sidesteps')} stageProcesses={stage.sidesteps} type='sidestep' />
        </Flex>
      </Flex>
    </FirstStageDropZone>
  );
};

const DeleteButton = ({ id, type }: { id: string; type: ElementType }) => {
  const { t } = useTranslation();
  const { deleteElementById } = useCaseMapData();
  const hotkeys = useKnownHotkeys();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            icon={IvyIcons.Trash}
            onClick={e => {
              e.stopPropagation();
              deleteElementById(id, type);
            }}
            aria-label={type === 'stage' ? hotkeys.deleteStage.label : t('hotkey.deleteProcess')}
          />
        </TooltipTrigger>
        <TooltipContent>{type === 'stage' ? hotkeys.deleteStage.label : t('hotkey.deleteProcess')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ProcessPart = ({
  stageId,
  stageProcesses,
  title,
  type
}: {
  stageId: string;
  title: string;
  stageProcesses?: StageProcessModel[];
  type: 'process' | 'sidestep';
}) => {
  const { selectedElement } = useAppContext();
  const { t } = useTranslation();
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({
    id: `empty-${type}-${stageId}`,
    disabled: dnd.active?.data?.current?.type !== 'process'
  });
  const readonly = useReadonly();
  const processesAvailable = stageProcesses !== undefined && stageProcesses.length > 0;
  const processSelected = useMemo(() => {
    return stageProcesses?.some(proc => proc.id === selectedElement?.id) ?? false;
  }, [selectedElement, stageProcesses]);
  return (
    <Flex direction='column' gap={2}>
      {processesAvailable ? (
        <>
          <DropZone id={`first-${type}-${stageId}`} postId={stageProcesses?.[0]?.id ?? undefined}>
            <Flex justifyContent='space-between' alignItems='center' className='font-bold'>
              {title}
              {!readonly && (
                <Flex gap={1}>
                  {processSelected && selectedElement && <DeleteButton id={selectedElement.id} type='process' />}
                  <AddProcessDialog type={type} stageId={stageId}>
                    <Button
                      size='small'
                      icon={IvyIcons.Plus}
                      aria-label={t('dialog.addProcess.title', { type: type.charAt(0).toUpperCase() + type.slice(1) })}
                    />
                  </AddProcessDialog>
                </Flex>
              )}
            </Flex>
          </DropZone>
          {stageProcesses?.map((proc, index) => (
            <ProcessTile key={proc.id} process={proc} type={type} postId={stageProcesses?.[index + 1]?.id ?? undefined} />
          ))}
        </>
      ) : (
        <>
          <div className='font-bold'>{title}</div>
          {!readonly ? (
            <AddProcessDialog type={type} stageId={stageId}>
              <Button
                className={cn(
                  'justify-between border! border-dashed! border-p75! bg-p50! p-2! text-xs! text-p300!',
                  isOver && 'border-p300! text-transparent!'
                )}
                data-dragging-over={isOver}
                ref={setNodeRef}
                disabled={readonly}
              >
                {t(`editor.flow.addFirstItem`, { item: title })}
                <IvyIcon icon={IvyIcons.Plus} />
              </Button>
            </AddProcessDialog>
          ) : (
            <div className='justify-between rounded-md border border-n200 bg-n50 p-2 text-xs text-n500'>
              {t('editor.flow.noProcesses', { item: title })}
            </div>
          )}
        </>
      )}
    </Flex>
  );
};
