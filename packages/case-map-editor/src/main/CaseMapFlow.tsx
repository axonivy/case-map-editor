import type { StageModel } from '@axonivy/case-map-editor-protocol';
import { Button, cn, Flex, PanelMessage, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { removeCSSPrefix } from '../detail/IconCombobox';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import './CaseMapFlow.css';
import { AddStageDialog } from './components/AddStageDialog';
import { StageTile } from './components/StageTile';

export const CaseMapFlow = () => {
  const { caseMap } = useAppContext();
  const readonly = useReadonly();
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const [showPlaceholder, setShowPlaceholder] = useState<number | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      const minStageWidth = 240; // StageTile min-width + gaps
      const gap = 60;
      let items = Math.floor((width + gap) / (minStageWidth + gap));
      items = Math.max(2, Math.min(items, 6));

      setItemsPerRow(items);
    };

    calculate();
    const resizeObserver = new ResizeObserver(calculate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
  }, []);

  const rows = useMemo(() => {
    if (!caseMap?.stages) return [];

    const result: { stages: StageModel[]; reversed: boolean }[] = [];
    let index = 0;
    let rowIndex = 0;

    while (index < caseMap.stages.length) {
      const slice = caseMap.stages.slice(index, index + itemsPerRow);
      const reversed = rowIndex % 2 === 1;

      result.push({
        stages: reversed ? [...slice].reverse() : slice,
        reversed
      });

      index += itemsPerRow;
      rowIndex++;
    }

    return result;
  }, [caseMap?.stages, itemsPerRow]);

  if (!caseMap || !caseMap.stages || caseMap.stages.length === 0) {
    return <EmptyState />;
  }
  return (
    <Flex ref={containerRef} direction='column' className='case-map-flow'>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className='case-map-row-wrapper'>
          <Flex
            direction='row'
            className={cn('case-map-row', row.reversed && 'reversed')}
            style={{ '--items-per-row': itemsPerRow } as React.CSSProperties}
          >
            {row.stages.map((stage, index) => {
              // Find the absolute index of this stage in the full stages array
              const absoluteIndex = caseMap.stages.findIndex(s => s.id === stage.id);
              const isFirstInRow = row.reversed ? index === row.stages.length - 1 : index === 0;
              const isLastInRow = row.reversed ? index === 0 : index === row.stages.length - 1;

              return (
                <div key={stage.id} className='stage-grid-item'>
                  <Flex direction='row' className='stage-container' style={{ height: '100%' }}>
                    <Flex direction='column' alignItems='center'>
                      <StageConnector
                        stage={stage}
                        hideLeftLine={row.reversed ? isLastInRow : isFirstInRow}
                        hideRightLine={row.reversed ? isFirstInRow : isLastInRow}
                      />
                      <div className='stage-vertical-line' />
                      <Flex
                        direction='column'
                        style={{
                          marginBottom: (row.reversed && !isLastInRow) || (!row.reversed && !isLastInRow) ? 'var(--size-4)' : undefined,
                          height: '100%'
                        }}
                        alignItems='center'
                      >
                        <StageTile stage={stage} />
                        {isLastInRow && absoluteIndex !== caseMap.stages.length - 1 ? <div className='stage-vertical-line' /> : null}
                      </Flex>
                    </Flex>

                    {((row.reversed && !isFirstInRow) || (!row.reversed && !isLastInRow)) && (
                      <AddStageSlot
                        index={absoluteIndex}
                        stageId={stage.id}
                        isLast={false}
                        hoverIndex={hoverIndex}
                        setHoverIndex={setHoverIndex}
                        showPlaceholder={showPlaceholder}
                        setShowPlaceholder={setShowPlaceholder}
                        postStageId={caseMap.stages?.[absoluteIndex + 1]?.id ?? undefined}
                      />
                    )}
                  </Flex>
                </div>
              );
            })}
          </Flex>
        </div>
      ))}

      {!readonly && <Flex style={{ height: '50vh' }} />}
    </Flex>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage
        icon={readonly ? IvyIcons.Search : IvyIcons.ActivitiesGroup}
        message={readonly ? t('editor.flow.noStages') : t('message.addFirstItem')}
        mode='column'
        style={{ height: 'unset' }}
      />

      {!readonly && (
        <AddStageDialog index={0}>
          <Button size='large' variant='primary' icon={IvyIcons.Plus} aria-label={hotkeys.addStage.label}>
            {t('dialog.addStage.title')}
          </Button>
        </AddStageDialog>
      )}
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
    <Flex className='stage-header' alignItems='center' justifyContent='center'>
      <div className={hideLeftLine ? 'stage-line-hidden' : 'stage-line'} />
      <div
        className={`stage-circle ${isStageSelected ? 'selected' : ''}`}
        onClick={e => {
          e.stopPropagation();
          setSelectedElement({ id: stage.id, type: 'stage' });
          setDetail(true);
        }}
      >
        <i className={removeCSSPrefix(stage.icon)} />
      </div>
      <div className={hideRightLine ? 'stage-line-hidden' : 'stage-line'} />
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
        <div className={!isLast ? 'stage-line' : 'stage-line-hidden'} />
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
