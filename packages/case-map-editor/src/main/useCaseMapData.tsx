import type { CaseMapModel, CreateProcessData, StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { EMPTY_DROP_ID_PREFIX, findElementById as findElementByIdHelper, modifyData, type ElementType } from '../data/data';
import { generateUniqueId } from '../utils/formatting';

export const useCaseMapData = () => {
  const { caseMap, setCaseMap, selectedElement, setSelectedElement, setDetail } = useAppContext();

  const deleteElementById = (id: string, type: ElementType) => {
    setCaseMap((old: CaseMapModel) => modifyData(old, { type: 'remove', data: { id } }).newData);

    if (selectedElement?.id === id && selectedElement?.type === type) {
      setSelectedElement(undefined);
      setDetail(false);
    }
  };

  const moveElement = (id: string, direction: 'moveUp' | 'moveDown') => {
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, { type: direction, data: { id } }).newData;
    });
  };

  const moveElementAfter = (id: string, targetId: string, type: ElementType) => {
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, { type: 'dnd', data: { activeId: id, targetId, type } }).newData;
    });
  };

  const createProcessElementAfter = (data: CreateProcessData, targetId: string) => {
    const newProcess = createProcess(data, caseMap);
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, {
        type: 'add',
        data: {
          newElement: newProcess,
          type: 'process',
          targetId: targetId
        }
      }).newData;
    });
  };

  const createStageWithProcessAfter = (data: CreateProcessData, targetId: string) => {
    const newStage = createStage(data.name, caseMap);
    const newCaseMap = modifyData(caseMap, {
      type: 'add',
      data: {
        newElement: newStage,
        type: 'stage'
      }
    }).newData;
    const newProcess = createProcess(data, newCaseMap);
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, {
        type: 'add',
        data: {
          newElement: { ...newStage, processes: [newProcess] },
          type: 'stage',
          targetId: targetId
        }
      }).newData;
    });
  };

  const createStageAndMoveProcessWithin = (activeId: string, targetId: string) => {
    setCaseMap((old: CaseMapModel) => {
      const newStage: StageModel = createStage(activeId, old);
      const newCaseMap = modifyData(old, {
        type: 'add',
        data: {
          newElement: newStage,
          type: 'stage',
          targetId: targetId
        }
      });

      return modifyData(newCaseMap.newData, {
        type: 'dnd',
        data: { activeId, targetId: EMPTY_DROP_ID_PREFIX + 'process-' + newCaseMap.newComponentId, type: 'process' }
      }).newData;
    });
  };

  const createFromPalette = (targetId: string, createData: CreateProcessData, overType?: string) => {
    if (!createData) return;

    if (overType === 'stage') {
      createStageWithProcessAfter(createData, targetId);
      return;
    }
    createProcessElementAfter(createData, targetId);
  };

  const moveElementDrop = (activeId: string, targetId: string, activeType: ElementType, overType?: string) => {
    if (overType === 'stage' && activeType === 'process') {
      createStageAndMoveProcessWithin(activeId, targetId);
      return;
    }
    moveElementAfter(activeId, targetId, activeType);
  };

  const findElementById = (id: string) => {
    return findElementByIdHelper(caseMap, id);
  };

  return {
    deleteElementById,
    moveElement,
    findElementById,
    createFromPalette,
    moveElementDrop
  };
};

const createProcess = (data: CreateProcessData, caseMap: CaseMapModel): StageProcessModel => ({
  id: generateUniqueId(data.name, caseMap),
  name: data.name,
  processToExecute: data.processToExecute,
  description: '',
  preCondition: { label: '', script: '' }
});

const createStage = (name: string, caseMap: CaseMapModel): StageModel => ({
  id: generateUniqueId(name, caseMap),
  name: name,
  description: '',
  icon: 'ti ti-check',
  isTerminating: false,
  processes: [],
  sidesteps: []
});
