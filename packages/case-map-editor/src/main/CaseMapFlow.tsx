import { Button, Flex, PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './CaseMapFlow.css';
import { StageTile } from './components/StageTile';

export const CaseMapFlow = () => {
  const { caseMap, selectedElement, setDetail, setSelectedElement } = useAppContext();
  const { t } = useTranslation();

  return caseMap.stages === undefined || caseMap.stages.length === 0 ? (
    <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
      <PanelMessage icon={IvyIcons.Database} message={t('message.addFirstItem')} mode='column' style={{ height: 'unset' }} />
      <Button
        size='large'
        variant='primary'
        icon={IvyIcons.Plus}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {t('dialog.addStage.title')}
      </Button>
    </Flex>
  ) : (
    <Flex direction='row' className='case-map-flow'>
      {caseMap.stages?.map((stage, index) => (
        <Flex key={stage.id} gap={4} direction='column' alignItems='center'>
          <Flex className='stage-header' alignItems='center' justifyContent='center'>
            <div className={index !== 0 ? 'stage-line' : 'stage-line-hidden'} />
            <div
              className={`stage-circle ${
                (selectedElement?.id === stage.id && selectedElement?.type === 'stage') ||
                stage.processes?.some(proc => proc.id === selectedElement?.id) ||
                stage.sidesteps?.some(proc => proc.id === selectedElement?.id)
                  ? 'selected'
                  : ''
              }`}
              onClick={e => {
                e.stopPropagation();
                setSelectedElement({ id: stage.id, type: 'stage' });
                setDetail(true);
              }}
            />
            <div className={index !== caseMap.stages.length - 1 ? 'stage-line' : 'stage-line-hidden'} />
          </Flex>
          <StageTile stage={stage} />
        </Flex>
      ))}
    </Flex>
  );
};
