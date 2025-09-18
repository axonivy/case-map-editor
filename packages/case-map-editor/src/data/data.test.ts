import type { CaseMapModel, StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { describe, expect } from 'vitest';
import { findElementById, modifyData } from './data';

const createProcess = (id: string): StageProcessModel => ({
  id: { id },
  name: `Process ${id}`,
  description: '',
  preCondition: { label: '', script: { script: '' } },
  processToExecute: { value: '' }
});

const createStage = (id: string, processes: string[], sidesteps: string[]): StageModel => ({
  id: { id },
  name: `Stage ${id}`,
  description: '',
  icon: '',
  isTerminating: false,
  processes: processes.map(createProcess),
  sideSteps: sidesteps.map(createProcess)
});

const baseModel = (): CaseMapModel => ({
  id: { id: 'root' },
  uuid: 'uuid',
  name: 'test model',
  description: '',
  stages: [createStage('s1', ['p1', 'p2'], []), createStage('s2', [], ['ss1', 'ss2']), createStage('s3', ['p3'], ['ss3'])]
});

describe('findElementById', () => {
  test('should find a stage by id', () => {
    const model = baseModel();
    const result = findElementById(model, 's1');
    expect(result?.type).toBe('stage');
    expect(result?.data.id.id).toBe('s1');
  });

  test('should find a process by id', () => {
    const model = baseModel();
    const result = findElementById(model, 'p1');
    expect(result?.type).toBe('process');
    expect(result?.type === 'process' ? result.parentId : undefined).toBe('s1');
    expect(result?.data.id.id).toBe('p1');
  });

  test('should find a sidestep by id', () => {
    const model = baseModel();
    const result = findElementById(model, 'ss1');
    expect(result?.type).toBe('sidestep');
    expect(result?.type === 'sidestep' ? result.parentId : undefined).toBe('s2');
    expect(result?.data.id.id).toBe('ss1');
  });

  test('should return undefined if not found', () => {
    const model = baseModel();
    expect(findElementById(model, 'x')).toBeUndefined();
  });

  test('should return undefined if model is missing', () => {
    expect(findElementById(undefined as unknown as CaseMapModel, 'x')).toBeUndefined();
  });
});

describe('modifyData - stages', () => {
  test('should add a new stage', () => {
    const model = baseModel();
    const newStage = createStage('s4', [], []);
    const { newData, newComponentId } = modifyData(model, {
      type: 'add',
      data: { newElement: newStage, type: 'stage' }
    });
    expect(newData.stages).toHaveLength(4);
    expect(newComponentId).toBe('s4');
  });

  test('should add a stage after another', () => {
    const model = baseModel();
    const newStage = createStage('s4', [], []);
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: newStage, type: 'stage', targetId: 's2' }
    });
    expect(newData.stages[2]?.id.id).toBe('s4');
  });

  test('should remove a stage', () => {
    const model = baseModel();
    const { newData } = modifyData(model, {
      type: 'remove',
      data: { id: 's1' }
    });
    expect(newData.stages).toHaveLength(2);
  });

  test('should move a stage up and down', () => {
    const model = baseModel();
    expect(model.stages[1]?.id.id).toBe('s2');
    let { newData } = modifyData(model, {
      type: 'moveUp',
      data: { id: 's2' }
    });
    expect(newData.stages[0]?.id.id).toBe('s2');

    ({ newData } = modifyData(newData, {
      type: 'moveDown',
      data: { id: 's2' }
    }));
    expect(newData.stages[1]?.id.id).toBe('s2');
  });
});

describe('modifyData - processes and sidesteps', () => {
  test('should add a process into a stage', () => {
    const model = baseModel();
    const process = createProcess('p1');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: process, type: 'process', parentId: 's1' }
    });
    expect(newData.stages[0]?.processes).toHaveLength(3);
  });

  test('should add a sidestep into a stage', () => {
    const model = baseModel();
    const sidestep = createProcess('ss3');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: sidestep, type: 'sidestep', parentId: 's2' }
    });
    expect(newData.stages[1]?.sideSteps).toHaveLength(3);
  });

  test('should add process after empty-process slot', () => {
    const model = baseModel();
    const p1 = createProcess('p3');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: p1, type: 'process', targetId: 'empty-process-s1' }
    });
    expect(newData.stages[0]?.processes).toHaveLength(3);
  });

  test('should add sidestep after empty-sidestep slot', () => {
    const model = baseModel();
    const ss1 = createProcess('ss1');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: ss1, type: 'process', targetId: 'empty-sidestep-s1' }
    });
    expect(newData.stages[0]?.sideSteps).toHaveLength(1);
  });

  test('should insert process after another process', () => {
    const model = baseModel();
    const p2 = createProcess('p5');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: p2, type: 'process', targetId: 'p1' }
    });
    expect(newData.stages[0]?.processes[1]?.id.id).toBe('p5');
  });

  test('should insert sidestep after another sidestep', () => {
    const model = baseModel();
    const ss2 = createProcess('ss5');
    const { newData } = modifyData(model, {
      type: 'add',
      data: { newElement: ss2, type: 'process', targetId: 'ss1', parentId: 's2' }
    });
    expect(newData.stages[1]?.sideSteps[1]?.id.id).toBe('ss5');
  });

  test('should remove a sidestep', () => {
    const model = baseModel();
    const { newData } = modifyData(model, {
      type: 'remove',
      data: { id: 'ss1' }
    });
    expect(newData.stages[1]?.sideSteps).toHaveLength(1);
  });

  test('should move a sidestep up and down', () => {
    const model = baseModel();
    let { newData } = modifyData(model, {
      type: 'moveUp',
      data: { id: 'ss2' }
    });
    expect(newData.stages[1]?.sideSteps[0]?.id.id).toBe('ss2');

    ({ newData } = modifyData(newData, {
      type: 'moveDown',
      data: { id: 'ss2' }
    }));
    expect(newData.stages[1]?.sideSteps[1]?.id.id).toBe('ss2');
  });
});

describe('modifyData - dnd', () => {
  test('should handle dnd for processes', () => {
    const model = baseModel();
    const { newData, newComponentId } = modifyData(model, {
      type: 'dnd',
      data: { activeId: 'p3', targetId: 'p1', type: 'process' }
    });
    expect(newComponentId).toBe('p3');
    expect(newData.stages[0]?.processes).toHaveLength(3);
    expect(newData.stages[2]?.processes).toHaveLength(0);
    expect(newData.stages[0]?.processes[0]?.id.id).toBe('p1');
    expect(newData.stages[0]?.processes[1]?.id.id).toBe('p3');
  });

  test('should handle dnd for sidesteps', () => {
    const model = baseModel();
    const { newData, newComponentId } = modifyData(model, {
      type: 'dnd',
      data: { activeId: 'ss3', targetId: 'ss1', type: 'process' }
    });
    expect(newComponentId).toBe('ss3');
    expect(newData.stages[2]?.sideSteps).toHaveLength(0);
    expect(newData.stages[1]?.sideSteps).toHaveLength(3);
    expect(newData.stages[1]?.sideSteps[0]?.id.id).toBe('ss1');
    expect(newData.stages[1]?.sideSteps[1]?.id.id).toBe('ss3');
  });

  test('should return undefined if dnd activeId not found', () => {
    const model = baseModel();
    const { newComponentId } = modifyData(model, {
      type: 'dnd',
      data: { activeId: 'x', targetId: 's1', type: 'process' }
    });
    expect(newComponentId).toBeUndefined();
  });
});

describe('edge cases', () => {
  test('should not break when moving non-existent element', () => {
    const model = baseModel();
    const { newData } = modifyData(model, { type: 'moveUp', data: { id: 'x' } });
    expect(newData.stages).toHaveLength(3);
  });

  test('should not add if parentId not found', () => {
    const model = baseModel();
    const p1 = createProcess('p1');
    const { newComponentId } = modifyData(model, {
      type: 'add',
      data: { newElement: p1, type: 'process', parentId: 'unknown' }
    });
    expect(newComponentId).toBeUndefined();
  });

  test('should gracefully skip move if remove fails', () => {
    const model = baseModel();
    const { newData } = modifyData(model, {
      type: 'moveDown',
      data: { id: 'not-found' }
    });
    expect(newData.stages[0]?.id.id).toBe('s1');
  });
});
