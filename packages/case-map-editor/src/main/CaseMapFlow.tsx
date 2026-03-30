import type { StageModel } from '@axonivy/case-map-editor-protocol';
import { Button, cn, Flex, PanelMessage, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { removeCSSPrefix } from '../detail/IconCombobox';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import { AddStageDialog } from './components/AddStageDialog';
import { StageTile } from './components/StageTile';

export const CaseMapFlow = () => {
  const { caseMap } = useAppContext();
  const readonly = useReadonly();
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const [showPlaceholder, setShowPlaceholder] = useState<number | undefined>();

  if (!caseMap || !caseMap.stages || caseMap.stages.length === 0) {
    return <EmptyState />;
  }

  return (
    <Flex direction='row' className='p-4' role='region' data-element-type='flow'>
      {caseMap.stages.map((stage, index) => (
        <Flex key={stage.id} direction='row'>
          <Flex gap={4} direction='column' alignItems='center'>
            <StageConnector
              stage={stage}
              hideLeftLine={(index === 0 || caseMap.stages[index - 1]?.isTerminating) ?? false}
              hideRightLine={(index === caseMap.stages.length - 1 && readonly) || stage.isTerminating}
            />
            <StageTile stage={stage} />
          </Flex>
          <AddStageSlot
            index={index}
            stageId={stage.id}
            stageIsTerminating={stage.isTerminating}
            isLast={index === caseMap.stages.length - 1}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            showPlaceholder={showPlaceholder}
            setShowPlaceholder={setShowPlaceholder}
            postStageId={caseMap.stages?.[index + 1]?.id ?? undefined}
          />
        </Flex>
      ))}
      {!readonly && <Flex className='w-[50vw] shrink-0' />}
    </Flex>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' className='h-full'>
      <PanelMessage
        icon={readonly ? IvyIcons.Search : IvyIcons.ActivitiesGroup}
        message={readonly ? t('editor.flow.noStages') : t('message.addFirstItem')}
        mode='column'
      >
        <AddStageDialog index={0}>
          <Button size='large' variant='primary' icon={IvyIcons.Plus} aria-label={hotkeys.addStage.label} disabled={readonly}>
            {t('dialog.addStage.title')}
          </Button>
        </AddStageDialog>
      </PanelMessage>
    </Flex>
  );
};

const StageConnector = ({ stage, hideLeftLine, hideRightLine }: { stage: StageModel; hideLeftLine: boolean; hideRightLine: boolean }) => {
  const { selectedElement, setSelectedElement, setDetail } = useAppContext();
  const isStageSelected =
    (selectedElement?.id === stage.id && selectedElement?.type === 'stage') ||
    stage.processes?.some(proc => proc.id === selectedElement?.id) ||
    stage.sidesteps?.some(proc => proc.id === selectedElement?.id);
  return (
    <Flex className='h-5.5 w-full' alignItems='center' justifyContent='center'>
      <div className={cn('h-px grow bg-p300', hideLeftLine && 'h-0.5 bg-transparent')} data-hide-left-line={hideLeftLine} />
      <div
        className={cn(
          'flex size-6.25 items-center justify-center rounded-full border border-p300 font-bold text-p300 transition-all hover:cursor-pointer hover:border-p300',
          isStageSelected && 'bg-p300 text-background'
        )}
        data-selected={isStageSelected}
        onClick={e => {
          e.stopPropagation();
          setSelectedElement({ id: stage.id, type: 'stage' });
          setDetail(true);
        }}
      >
        <i className={removeCSSPrefix(stage.icon)} />
      </div>
      <div className={cn('h-px grow bg-p300', hideRightLine && 'h-0.5 bg-transparent')} data-hide-right-line={hideRightLine} />
    </Flex>
  );
};

const AddStageSlot = ({
  index,
  isLast,
  hoverIndex,
  setHoverIndex,
  showPlaceholder,
  setShowPlaceholder,
  stageIsTerminating,
  stageId,
  postStageId
}: {
  index: number;
  isLast: boolean;
  hoverIndex?: number;
  setHoverIndex: (i?: number) => void;
  showPlaceholder?: number;
  setShowPlaceholder: (i?: number) => void;
  stageId: string;
  stageIsTerminating: boolean;
  postStageId?: string;
}) => {
  const dnd = useDndContext();
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  const { isOver, setNodeRef } = useDroppable({
    id: stageId,
    disabled: dnd.active?.id === stageId || dnd.active?.id === postStageId || dnd.active?.data?.current?.type !== 'stage'
  });

  return (
    <Flex gap={4} direction='column' alignItems='center' className='flex-1'>
      <Flex
        className='h-5.5 w-full'
        alignItems='center'
        justifyContent='center'
        onMouseOver={() => setHoverIndex(index)}
        onMouseOut={() => setShowPlaceholder(undefined)}
      >
        {!readonly && (hoverIndex === index || isLast) && (
          <AddStageDialog index={hoverIndex ? hoverIndex + 1 : index + 1}>
            <Button
              className='size-6.25! rounded-full! border! border-p300! bg-p50!'
              icon={IvyIcons.Plus}
              onMouseOver={() => setShowPlaceholder(index)}
              aria-label={hotkeys.addStage.label}
            />
          </AddStageDialog>
        )}
        <div
          className={cn('h-px grow bg-p300', isLast && 'h-0.5 bg-transparent', stageIsTerminating && 'h-0 bg-transparent')}
          data-last={isLast}
        />
      </Flex>

      <Flex className='flex-1' ref={setNodeRef}>
        <div className='m-0.5 h-full w-[8.5px] bg-transparent' onMouseEnter={() => setHoverIndex(index)} />
        <Flex
          direction='column'
          className={cn(
            'h-12.5 w-0 transition-[width,height]',
            (showPlaceholder === index || isOver) && 'h-full w-0.5 cursor-pointer border border-dashed border-p300 bg-p300 text-p300'
          )}
          data-show-placeholder={showPlaceholder === index || isOver}
          alignItems='center'
        />
        <div className='m-0.5 h-full w-[8.5px] bg-transparent' onMouseEnter={() => setHoverIndex(index)} />
      </Flex>
    </Flex>
  );
};
