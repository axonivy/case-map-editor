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
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { useCaseMapData } from '../useCaseMapData';
import { AddProcessDialog } from './AddProcessDialog';
import { DropZone, FirstStageDropZone } from './DropZone';
import { ProcessTile } from './ProcessTile';
import './StageTile.css';
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
        className={cn('stage-tile', { selected: isSelected, dragging })}
        direction='column'
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        style={{ flexWrap: 'wrap' }}
        gap={3}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Flex className='stage-tile-header' alignItems='center' justifyContent='space-between' gap={2}>
          <Flex gap={2} alignItems='center' className='stage-tile-name'>
            {stage.name}
          </Flex>
          {!readonly && <DeleteStageButton stageId={stage.id} />}
        </Flex>
        <Separator style={{ marginBlock: 'unset' }} />
        <Flex direction='column' gap={3}>
          <ProcessPart stageId={stage.id} title={t('editor.flow.processes')} stageProcesses={stage.processes} type='process' />
          <ProcessPart stageId={stage.id} title={t('editor.flow.sidesteps')} stageProcesses={stage.sidesteps} type='sidestep' />
        </Flex>
      </Flex>
    </FirstStageDropZone>
  );
};

const DeleteStageButton = ({ stageId }: { stageId: string }) => {
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
              deleteElementById(stageId, 'stage');
            }}
            aria-label={hotkeys.deleteStage.label}
          />
        </TooltipTrigger>
        <TooltipContent>{hotkeys.deleteStage.label}</TooltipContent>
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
  const { t } = useTranslation();
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({
    id: `empty-${type}-${stageId}`,
    disabled: dnd.active?.data?.current?.type !== 'process'
  });
  const readonly = useReadonly();
  const processesAvailable = stageProcesses !== undefined && stageProcesses.length > 0;
  return (
    <Flex direction='column' gap={2}>
      {processesAvailable ? (
        <>
          <DropZone id={`first-${type}-${stageId}`} postId={stageProcesses?.[0]?.id ?? undefined}>
            <Flex justifyContent='space-between' alignItems='center' style={{ fontWeight: 'bold' }}>
              {title}
              {!readonly && (
                <AddProcessDialog type={type} stageId={stageId}>
                  <Button size='small' icon={IvyIcons.Plus} />
                </AddProcessDialog>
              )}
            </Flex>
          </DropZone>
          {stageProcesses?.map((proc, index) => (
            <ProcessTile key={proc.id} process={proc} type={type} postId={stageProcesses?.[index + 1]?.id ?? undefined} />
          ))}
        </>
      ) : (
        <>
          <div style={{ fontWeight: 'bold' }}>{title}</div>
          {!readonly ? (
            <AddProcessDialog type={type} stageId={stageId}>
              <Button className={cn('add-process-button', { 'is-drop-target': isOver })} ref={setNodeRef} disabled={readonly}>
                {t(`editor.flow.addFirstItem`, { item: title })}
                <IvyIcon icon={IvyIcons.Plus} />
              </Button>
            </AddProcessDialog>
          ) : (
            <div className='no-processes-message'>{t('editor.flow.noProcesses', { item: title })}</div>
          )}
        </>
      )}
    </Flex>
  );
};
