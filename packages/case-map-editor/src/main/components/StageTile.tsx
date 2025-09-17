import type { Stage, StageProcess } from '@axonivy/case-map-editor-protocol';
import { Button, Flex, IvyIcon, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { AddProcessDialog } from './AddProcessDialog';
import { ProcessTile } from './ProcessTile';
import './StageTile.css';

export const StageTile = ({ stage, onMouseOver }: { stage: Stage; onMouseOver?: () => void }) => {
  const { t } = useTranslation();
  const { setSelectedElement, setDetail, selectedElement, setCaseMap } = useAppContext();

  const deleteStage = (id: string) => {
    setCaseMap(old => {
      const newDataClass = structuredClone(old);
      newDataClass.stages = newDataClass.stages.filter(s => s.id !== id);
      return newDataClass;
    });

    if (selectedElement?.id === id && selectedElement?.type === 'stage') {
      setSelectedElement(undefined);
      setDetail(false);
    }
  };

  return (
    <>
      <Flex
        className={`stage-tile ${selectedElement?.id === stage.id && selectedElement?.type === 'stage' ? 'selected' : ''}`}
        direction='column'
        onClick={e => {
          e.stopPropagation();
          setSelectedElement({ id: stage.id, type: 'stage' });
          setDetail(true);
        }}
        style={{ flexWrap: 'wrap' }}
        gap={3}
        onMouseOver={onMouseOver}
      >
        <Flex className='stage-tile-header' alignItems='center' justifyContent='space-between' gap={2}>
          <Flex gap={2} alignItems='center'>
            <i className={stage.icon} />
            <div className='stage-tile-name'>{stage.name}</div>
          </Flex>
          <Button
            icon={IvyIcons.Trash}
            onClick={e => {
              e.stopPropagation();
              deleteStage(stage.id);
            }}
          />
        </Flex>
        <Separator style={{ marginBlock: 'unset' }} />
        <Flex direction='column' gap={3}>
          <ProcessPart stageId={stage.id} title={t('editor.flow.processes')} stageProcesses={stage.processes} type='process' />
          <ProcessPart stageId={stage.id} title={t('editor.flow.sidesteps')} stageProcesses={stage.sidesteps} type='sidestep' />
        </Flex>
      </Flex>
    </>
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
  stageProcesses?: StageProcess[];
  type: 'process' | 'sidestep';
}) => {
  const { t } = useTranslation();
  const processesAvailable = stageProcesses !== undefined && stageProcesses.length > 0;
  return (
    <Flex direction='column' gap={2}>
      <Flex justifyContent='space-between' alignItems='center' style={{ fontWeight: 'bold' }}>
        {title}
        {processesAvailable && (
          <AddProcessDialog type={type} stageId={stageId}>
            <Button size='small' icon={IvyIcons.Plus} />
          </AddProcessDialog>
        )}
      </Flex>
      {!processesAvailable && (
        <AddProcessDialog type={type} stageId={stageId}>
          <Button className='add-process-button'>
            {t(`editor.flow.addFirstItem`, { item: title })}
            <IvyIcon icon={IvyIcons.Plus} />
          </Button>
        </AddProcessDialog>
      )}
      {stageProcesses?.map(proc => (
        <ProcessTile key={proc.id} process={proc} type={type} />
      ))}
    </Flex>
  );
};
