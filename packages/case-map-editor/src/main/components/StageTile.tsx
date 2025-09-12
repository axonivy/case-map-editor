import type { Stage, StageProcess } from '@axonivy/case-map-editor-protocol';
import { Button, Flex, IvyIcon, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { ProcessTile } from './ProcessTile';
import './StageTile.css';

export const StageTile = ({ stage }: { stage: Stage }) => {
  const { t } = useTranslation();
  const { setSelectedElement, setDetail, selectedElement } = useAppContext();

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
      >
        <Flex className='stage-tile-header' alignItems='center' gap={2}>
          <i className={stage.icon} />
          <div className='stage-tile-name'>{stage.name}</div>
        </Flex>
        <Separator style={{ marginBlock: 'unset' }} />
        <Flex direction='column' gap={3}>
          <ProcessPart title={t('editor.flow.processes')} stageProcesses={stage.processes} type='process' />
          <ProcessPart title={t('editor.flow.sidesteps')} stageProcesses={stage.sidesteps} type='sidestep' />
        </Flex>
      </Flex>
    </>
  );
};

const ProcessPart = ({ stageProcesses, title, type }: { title: string; stageProcesses?: StageProcess[]; type: 'process' | 'sidestep' }) => {
  const { t } = useTranslation();
  const processesAvailable = stageProcesses !== undefined && stageProcesses.length > 0;
  return (
    <Flex direction='column' gap={2}>
      <Flex justifyContent='space-between' alignItems='center' style={{ fontWeight: 'bold' }}>
        {title}
        {processesAvailable && <Button size='small' icon={IvyIcons.Plus} />}
      </Flex>
      {!processesAvailable && (
        <Button className='add-process-button'>
          {t(`editor.flow.addFirstItem`, { item: title })}
          <IvyIcon icon={IvyIcons.Plus} />
        </Button>
      )}
      {stageProcesses?.map(proc => (
        <ProcessTile key={proc.id} process={proc} type={type} />
      ))}
    </Flex>
  );
};
