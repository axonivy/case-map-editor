import type { CaseMap, Stage, StageProcess } from '@axonivy/case-map-editor-protocol';

export const findElementById = (data: CaseMap, id?: string): Stage | StageProcess | undefined => {
  if (!id) {
    return;
  }
  for (const stage of data.stages) {
    if (stage.id === id) {
      return stage;
    }

    if (stage.processes) {
      const foundProc = stage.processes.find(proc => proc.id === id);
      if (foundProc) {
        return foundProc;
      }
    }

    if (stage.sidesteps) {
      const foundSide = stage.sidesteps.find(side => side.id === id);
      if (foundSide) {
        return foundSide;
      }
    }
  }

  // Not found
  return undefined;
};

export const isStage = (element: unknown): element is Stage => {
  return typeof element === 'object' && element !== null && 'id' in element && 'processes' in element;
};

export const isStageProcess = (element: unknown): element is StageProcess => {
  return typeof element === 'object' && element !== null && 'id' in element && 'processToExecute' in element;
};
