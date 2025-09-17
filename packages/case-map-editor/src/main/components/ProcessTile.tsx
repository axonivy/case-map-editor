import type { StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../context/AppContext';
import './ProcessTile.css';

export const ProcessTile = ({ process, type }: { process: StageProcessModel; type: 'process' | 'sidestep' }) => {
  const { selectedElement, setSelectedElement, setDetail } = useAppContext();
  return (
    <Flex
      key={process.id.id}
      className={`${type}-tile ${selectedElement?.id === process.id.id && selectedElement?.type === 'process' ? 'selected' : ''}`}
      alignItems='center'
      justifyContent='space-between'
      onClick={e => {
        e.stopPropagation();
        setSelectedElement({ id: process.id.id, type: 'process' });
        setDetail(true);
      }}
    >
      <Flex alignItems='center' gap={1} style={{ overflow: 'hidden' }}>
        <IvyIcon icon={IvyIcons.EditDots} />
        <div className='process-tile-name'> {process.name}</div>
      </Flex>
      {process.preCondition !== undefined && process.preCondition.label.length > 0 && process.preCondition.script.script.length > 0 && (
        <IvyIcon className='process-tile-condition-badge' icon={IvyIcons.Condition} />
      )}
    </Flex>
  );
};
