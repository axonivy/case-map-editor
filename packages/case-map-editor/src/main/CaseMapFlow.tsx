import type { StageModel } from '@axonivy/case-map-editor-protocol';
import { Button, cn, Flex, PanelMessage, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import './CaseMapFlow.css';
import { AddStageDialog } from './components/AddStageDialog';
import { StageTile } from './components/StageTile';

export const CaseMapFlow = () => {
  const { caseMap } = useAppContext();
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const [showPlaceholder, setShowPlaceholder] = useState<number | undefined>();

  if (!caseMap || !caseMap.stages || caseMap.stages.length === 0) {
    return <EmptyState />;
  }

  return (
    <Flex direction='row' className='case-map-flow'>
      {caseMap.stages.map((stage, index) => (
        <Flex key={stage.id} direction='row'>
          <Flex gap={4} direction='column' alignItems='center'>
            <StageConnector stage={stage} showLeftLine={index !== 0} />
            <StageTile stage={stage} />
          </Flex>
          <AddStageSlot
            index={index}
            stageId={stage.id}
            isLast={index === caseMap.stages.length - 1}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            showPlaceholder={showPlaceholder}
            setShowPlaceholder={setShowPlaceholder}
            postStageId={caseMap.stages?.[index + 1]?.id ?? undefined}
          />
        </Flex>
      ))}
      <Flex style={{ width: '50vw', flexShrink: 0 }} />
    </Flex>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage icon={IvyIcons.Database} message={t('message.addFirstItem')} mode='column' style={{ height: 'unset' }} />

      <AddStageDialog index={0}>
        <Button size='large' variant='primary' icon={IvyIcons.Plus} aria-label={hotkeys.addStage.label}>
          {t('dialog.addStage.title')}
        </Button>
      </AddStageDialog>
    </Flex>
  );
};

const StageConnector = ({ stage, showLeftLine }: { stage: StageModel; showLeftLine: boolean }) => {
  const { selectedElement, setSelectedElement, setDetail } = useAppContext();
  const isStageSelected =
    (selectedElement?.id === stage.id && selectedElement?.type === 'stage') ||
    stage.processes?.some(proc => proc.id === selectedElement?.id) ||
    stage.sidesteps?.some(proc => proc.id === selectedElement?.id);
  return (
    <Flex className='stage-header' alignItems='center' justifyContent='center'>
      <div className={showLeftLine ? 'stage-line' : 'stage-line-hidden'} />
      <div
        className={`stage-circle ${isStageSelected ? 'selected' : ''}`}
        onClick={e => {
          e.stopPropagation();
          setSelectedElement({ id: stage.id, type: 'stage' });
          setDetail(true);
        }}
      >
        <i className={stage.icon} />
      </div>
      <div className='stage-line' />
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
    <Flex gap={4} direction='column' alignItems='center' style={{ flex: 1 }}>
      <Flex
        className='stage-header'
        alignItems='center'
        justifyContent='center'
        onMouseOver={() => setHoverIndex(index)}
        onMouseOut={() => setShowPlaceholder(undefined)}
      >
        {!readonly && (hoverIndex === index || isLast) && (
          <AddStageDialog index={hoverIndex ? hoverIndex + 1 : index + 1}>
            <Button
              className='add-stage-button'
              icon={IvyIcons.Plus}
              onMouseOver={() => setShowPlaceholder(index)}
              aria-label={hotkeys.addStage.label}
            />
          </AddStageDialog>
        )}
        <div className={!isLast ? 'stage-line' : 'stage-line-hidden'} />
      </Flex>

      <Flex style={{ flex: 1 }} ref={setNodeRef}>
        <div className='add-stage-slot' onMouseEnter={() => setHoverIndex(index)} />
        <Flex
          direction='column'
          className={cn('placeholder-stage', showPlaceholder === index && 'visible', isOver && 'is-drop-target')}
          alignItems='center'
        />
        <div className='add-stage-slot' onMouseEnter={() => setHoverIndex(index)} />
      </Flex>
    </Flex>
  );
};
