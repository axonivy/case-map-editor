import type { CaseMapModel, StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { add, remove } from '../utils/array';
export type ElementType = 'stage' | 'process' | 'sidestep';
type ModifyAction =
  | {
      type: 'dnd';
      data: {
        activeId: string;
        targetId: string;
        type: ElementType;
      };
    }
  | {
      type: 'add';
      data: {
        newElement: StageModel | StageProcessModel;
        type: ElementType;
        targetId?: string;
        parentId?: string;
      };
    }
  | { type: 'remove' | 'moveUp' | 'moveDown'; data: { id: string } };

export const modifyData = (data: CaseMapModel, action: ModifyAction) => {
  const newData = structuredClone(data);
  let newComponentId;
  switch (action.type) {
    case 'dnd':
      newComponentId = dndModify(newData, action.data);
      break;
    case 'add':
      newComponentId = addElement(newData, action.data.newElement, action.data.type, action.data.targetId, action.data.parentId);
      break;
    case 'remove':
      removeElement(newData, action.data.id);
      break;
    case 'moveUp':
      moveElement(newData, action.data.id, -1);
      break;
    case 'moveDown':
      moveElement(newData, action.data.id, 1);
      break;
  }
  return { newData, newComponentId };
};

const removeElement = (data: CaseMapModel, id: string) => {
  const find = findElementById(data, id);
  if (find) {
    if (find.type === 'stage') {
      return remove(find.parentArray, find.index);
    }
    if (find.type === 'process' || find.type === 'sidestep') {
      return remove(find.parentArray, find.index);
    }
  }
  return;
};

const moveElement = (data: CaseMapModel, id: string, indexMove: number) => {
  const find = findElementById(data, id);
  if (find) {
    if (find.type === 'stage') {
      moveArrayItem(find.parentArray, find.index, indexMove);
      return;
    }
    if (find.type === 'process' || find.type === 'sidestep') {
      moveArrayItem(find.parentArray, find.index, indexMove);
      return;
    }
  }
  return;
};

const moveArrayItem = (parentArray: Array<StageModel | StageProcessModel>, index: number, offset: number) => {
  const removed = remove(parentArray, index);
  if (removed === undefined) {
    return;
  }
  const moveIndex = index + offset < 0 ? 0 : index + offset;
  add(parentArray, removed, moveIndex);
};

export type FindElement = { index: number } & (
  | {
      data: StageModel;
      parentArray: Array<StageModel>;
      type: 'stage';
    }
  | {
      data: StageProcessModel;
      parentArray: Array<StageProcessModel>;
      type: 'process' | 'sidestep';
      parentId: string;
    }
);

export const findElementById = (caseMap: CaseMapModel, id: string): FindElement | undefined => {
  if (!caseMap) {
    return undefined;
  }
  const stage = caseMap.stages.find(s => s.id.id === id);
  if (stage) return { data: stage, parentArray: caseMap.stages, index: caseMap.stages.indexOf(stage), type: 'stage' };
  for (const s of caseMap.stages) {
    const process = s.processes.find(p => p.id.id === id);
    if (process)
      return { data: process, parentArray: s.processes, index: s.processes.indexOf(process), type: 'process', parentId: s.id.id };

    const sidestep = s.sideSteps.find(ss => ss.id.id === id);
    if (sidestep)
      return { data: sidestep, parentArray: s.sideSteps, index: s.sideSteps.indexOf(sidestep), type: 'sidestep', parentId: s.id.id };
  }

  return undefined;
};

const dndModify = (data: CaseMapModel, action: Extract<ModifyAction, { type: 'dnd' }>['data']) => {
  const removed = removeElement(data, action.activeId);
  if (removed) {
    return addElement(data, removed, action.type, action.targetId);
  }
  return undefined;
};

const addElement = (
  data: CaseMapModel,
  element: StageModel | StageProcessModel,
  type: ElementType,
  insertAfterId?: string,
  parentId?: string
) => {
  if (type === 'stage') {
    if (!insertAfterId || insertAfterId.startsWith('first-stage')) {
      data.stages.unshift(element as StageModel);
      return (element as StageModel).id.id;
    }
    const index = data.stages.findIndex(p => p.id.id === insertAfterId);
    if (index !== -1) {
      add(data.stages, element as StageModel, index + 1);
      return (element as StageModel).id.id;
    }
  }
  if (!insertAfterId) {
    const parentStage = data.stages.find(s => s.id.id === parentId);
    if (parentStage) {
      return pushElementToStage(parentStage, type, element as StageProcessModel);
    }
  }
  if (type === 'process') {
    if (insertAfterId?.startsWith('empty-') || insertAfterId?.startsWith('first-')) {
      const [, emptyType, stageId] = insertAfterId.split('-');
      const stage = data.stages.find(s => s.id.id === stageId);
      if (stage) {
        return pushElementToStage(stage, emptyType as 'process' | 'sidestep', element as StageProcessModel);
      }
    }
    const foundElement = findElementById(data, insertAfterId ?? '');
    const parentStage = data.stages.find(
      s => s.id.id === (foundElement && foundElement.type !== 'stage' ? foundElement.parentId : undefined)
    );

    if (parentStage) {
      let index = parentStage.processes.findIndex(p => p.id.id === insertAfterId);
      if (index === -1) {
        index = parentStage.sideSteps.findIndex(p => p.id.id === insertAfterId);
        if (index !== -1) {
          add(parentStage.sideSteps, element as StageProcessModel, index + 1);
          return (element as StageProcessModel).id.id;
        }
      }
      add(parentStage.processes, element as StageProcessModel, index + 1);
      return (element as StageProcessModel).id.id;
    }
  }
};

const pushElementToStage = (stage: StageModel, type: ElementType, element: StageProcessModel): string => {
  const target = type === 'process' ? stage.processes : type === 'sidestep' ? stage.sideSteps : [];
  target.unshift(element);
  return element.id.id;
};
