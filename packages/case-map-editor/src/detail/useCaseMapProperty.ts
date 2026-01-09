import type { CaseMapModel, ProcessPreCondition, StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { useAppContext } from '../context/AppContext';

export const useStageProperty = () => {
  const { caseMap, setCaseMap, selectedElement } = useAppContext();

  if (!selectedElement || selectedElement.type !== 'stage') {
    return { stage: undefined, setProperty: () => {} };
  }

  const stage = caseMap.stages.find(s => s.id === selectedElement.id);

  const setProperty = <K extends keyof StageModel>(key: K, value: StageModel[K]) => {
    setCaseMap(old =>
      updateStage(old, selectedElement.id, stage => {
        stage[key] = value;
      })
    );
  };

  return { stage, setProperty };
};

export const useStageProcessProperty = () => {
  const { caseMap, setCaseMap, selectedElement } = useAppContext();

  if (!selectedElement || selectedElement.type !== 'process') {
    return { process: undefined, setProperty: () => {} };
  }

  let process: StageProcessModel | undefined;

  for (const stage of caseMap.stages) {
    process = stage.processes?.find(p => p.id === selectedElement.id) ?? stage.sidesteps?.find(s => s.id === selectedElement.id);
    if (process) break;
  }

  const setProperty = <K extends keyof StageProcessModel>(key: K, value: StageProcessModel[K]) => {
    setCaseMap(old =>
      updateProcessOrSidestep(old, selectedElement.id, process => {
        process[key] = value;
      })
    );
  };
  const setPropertyPreCondition = <K extends keyof ProcessPreCondition>(key: K, value: ProcessPreCondition[K]) => {
    setCaseMap(old =>
      updateProcessOrSidestep(old, selectedElement.id, proc => {
        proc.preCondition = {
          ...proc.preCondition,
          [key]: value
        };
      })
    );
  };

  return { process, setProperty, setPropertyPreCondition };
};

const updateStage = (caseMap: CaseMapModel, elementId: string, updater: (stage: StageModel) => void): CaseMapModel => {
  const newCaseMap: CaseMapModel = structuredClone(caseMap);
  const stageIdx = newCaseMap.stages.findIndex(s => s.id === elementId);

  if (stageIdx !== -1 && newCaseMap.stages[stageIdx]) {
    updater(newCaseMap.stages[stageIdx]);
  }

  return newCaseMap;
};

const updateProcessOrSidestep = (caseMap: CaseMapModel, elementId: string, updater: (proc: StageProcessModel) => void): CaseMapModel => {
  const newCaseMap: CaseMapModel = structuredClone(caseMap);

  for (const stage of newCaseMap.stages) {
    const procIdx = stage.processes.length > 0 ? stage.processes.findIndex(p => p.id === elementId) : -1;
    if (procIdx !== undefined && procIdx !== -1 && stage.processes[procIdx]) {
      updater(stage.processes[procIdx]);
      return newCaseMap;
    }

    const sideIdx = stage.sidesteps?.findIndex(s => s.id === elementId);
    if (sideIdx !== undefined && sideIdx !== -1 && stage.sidesteps[sideIdx]) {
      updater(stage.sidesteps[sideIdx]);
      return newCaseMap;
    }
  }

  return newCaseMap;
};
