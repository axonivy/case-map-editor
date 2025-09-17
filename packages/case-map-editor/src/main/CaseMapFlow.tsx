import type { Stage } from '@axonivy/case-map-editor-protocol';
import { Button, Flex, PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './CaseMapFlow.css';
import { AddStageDialog } from './components/AddStageDialog';
import { StageTile } from './components/StageTile';

export const CaseMapFlow = () => {
  const { caseMap } = useAppContext();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState<number | null>(null);

  if (!caseMap.stages || caseMap.stages.length === 0) {
    return <EmptyState />;
  }

  return (
    <Flex direction='row' className='case-map-flow'>
      {caseMap.stages.map((stage, index) => {
        return (
          <Flex key={stage.id} direction='row'>
            <Flex gap={4} direction='column' alignItems='center'>
              <StageConnector stage={stage} showLeftLine={index !== 0} />
              <StageTile stage={stage} />
            </Flex>
            <AddStageSlot
              index={index}
              isLast={index === caseMap.stages.length - 1}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              showPlaceholder={showPlaceholder}
              setShowPlaceholder={setShowPlaceholder}
            />
          </Flex>
        );
      })}
      <Flex style={{ width: '50vw', flexShrink: 0 }} />
    </Flex>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage icon={IvyIcons.Database} message={t('message.addFirstItem')} mode='column' style={{ height: 'unset' }} />

      <AddStageDialog index={0}>
        <Button size='large' variant='primary' icon={IvyIcons.Plus} onClick={() => {}}>
          {t('dialog.addStage.title')}
        </Button>
      </AddStageDialog>
    </Flex>
  );
};

const StageConnector = ({ stage, showLeftLine }: { stage: Stage; showLeftLine: boolean }) => {
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
        onClick={() => {
          setSelectedElement({ id: stage.id, type: 'stage' });
          setDetail(true);
        }}
      />
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
  setShowPlaceholder
}: {
  index: number;
  isLast: boolean;
  hoverIndex: number | null;
  setHoverIndex: (i: number | null) => void;
  showPlaceholder: number | null;
  setShowPlaceholder: (i: number | null) => void;
}) => {
  return (
    <Flex gap={4} direction='column' alignItems='center' style={{ flex: 1 }}>
      <Flex
        className='stage-header'
        alignItems='center'
        justifyContent='center'
        onMouseOver={() => setHoverIndex(index)}
        onMouseOut={() => setShowPlaceholder(null)}
      >
        {(hoverIndex === index || isLast) && (
          <AddStageDialog index={hoverIndex ? hoverIndex + 1 : index + 1}>
            <Button className='add-stage-button' icon={IvyIcons.Plus} onMouseOver={() => setShowPlaceholder(index)} />
          </AddStageDialog>
        )}
        <div className={!isLast ? 'stage-line' : 'stage-line-hidden'} />
      </Flex>
      <Flex style={{ flex: 1 }}>
        <div className='add-stage-slot' onMouseEnter={() => setHoverIndex(index)} />
        <Flex direction='column' className={`placeholder-stage ${showPlaceholder === index ? 'visible' : ''}`} alignItems='center' />
        <div className='add-stage-slot' onMouseEnter={() => setHoverIndex(index)} />
      </Flex>
    </Flex>
  );
};
