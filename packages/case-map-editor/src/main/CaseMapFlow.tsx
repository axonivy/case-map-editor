import type { Stage, StageProcess } from '@axonivy/case-map-editor-protocol';
import { Button, Flex, IvyIcon, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './CaseMapFlow.css';

export const CaseMapFlow = () => {
  const { caseMap, setDetail, setSelectedElement } = useAppContext();

  return (
    <Flex direction='row'>
      {caseMap.stages?.map((stage, index) => (
        <Flex key={stage.id} className='stage-container' direction='column' alignItems='center'>
          <div className='stage-header'>
            <div className={index !== 0 ? 'stage-line' : 'stage-line-hidden'} />
            <div
              className='stage-circle'
              onClick={e => {
                e.stopPropagation();
                setSelectedElement(stage.id);
                setDetail(true);
              }}
            >
              {index + 1}
            </div>
            <div className={index !== caseMap.stages.length - 1 ? 'stage-line' : 'stage-line-hidden'} />
          </div>
          <StageTile stage={stage} />
        </Flex>
      ))}
    </Flex>
  );
};

export const StageTile = ({ stage }: { stage: Stage }) => {
  const { t } = useTranslation();
  const { setSelectedElement, setDetail } = useAppContext();
  const displaySidestep = stage.sidesteps !== undefined && stage.sidesteps.length > 0;
  return (
    <>
      <div className='stage-tile-triangle' />
      <Flex
        className='stage-tile'
        direction='column'
        onClick={e => {
          e.stopPropagation();
          setSelectedElement(stage.id);
          setDetail(true);
        }}
        style={{ flexWrap: 'wrap' }}
      >
        <div className='stage-tile-header'>{stage.name}</div>
        <Flex className='stage-tile-content' direction='column' gap={3}>
          {stage.processes?.map(proc => (
            <ProcessTile key={proc.id} process={proc} />
          ))}
          <Flex justifyContent='flex-end' alignItems='center'>
            <Button variant='outline' icon={IvyIcons.Plus}>
              {t('editor.flow.addProcess')}
            </Button>
          </Flex>
          {displaySidestep && <Separator style={{ marginBlock: 'unset' }} />}
          {stage.sidesteps?.map(side => (
            <ProcessTile key={side.id} process={side} />
          ))}
          {displaySidestep && (
            <Flex justifyContent='flex-end' alignItems='center'>
              <Button variant='outline' icon={IvyIcons.Plus}>
                {t('editor.flow.addSidestep')}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

const ProcessTile = ({ process }: { process: StageProcess }) => {
  const { setSelectedElement, setDetail } = useAppContext();
  return (
    <Flex
      key={process.id}
      className='stage-process-tile'
      alignItems='center'
      justifyContent='space-between'
      onClick={e => {
        e.stopPropagation(); // <-- prevent event bubbling to StageTile
        setSelectedElement(process.id);
        setDetail(true);
      }}
    >
      {process.name}
      {process.preCondition !== undefined && process.preCondition.label.length > 0 && process.preCondition.script.length > 0 && (
        <IvyIcon className='process-tile-condition-badge' icon={IvyIcons.Condition} />
      )}
    </Flex>
  );
};
