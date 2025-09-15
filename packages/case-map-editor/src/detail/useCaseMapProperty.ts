import type { CaseMap, ProcessPreCondition, Stage, StageProcess } from '@axonivy/case-map-editor-protocol';
import { useAppContext } from '../context/AppContext';

export const useStageProperty = () => {
  const { caseMap, setCaseMap, selectedElement } = useAppContext();

  if (!selectedElement || selectedElement.type !== 'stage') {
    return { stage: undefined, setProperty: () => {} };
  }

  const stage = caseMap.stages.find(s => s.id === selectedElement.id);

  const setProperty = <K extends keyof Stage>(key: K, value: Stage[K]) => {
    setCaseMap(old => {
      const newCaseMap: CaseMap = structuredClone(old);
      const idx = newCaseMap.stages.findIndex(s => s.id === selectedElement.id);
      if (idx !== -1 && newCaseMap.stages[idx]) {
        newCaseMap.stages[idx][key] = value;
      }
      return newCaseMap;
    });
  };

  return { stage, setProperty };
};

export const useStageProcessProperty = () => {
  const { caseMap, setCaseMap, selectedElement } = useAppContext();

  if (!selectedElement || selectedElement.type !== 'process') {
    return { process: undefined, setProperty: () => {} };
  }

  let process: StageProcess | undefined;

  for (const stage of caseMap.stages) {
    process = stage.processes?.find(p => p.id === selectedElement.id) ?? stage.sidesteps?.find(s => s.id === selectedElement.id);
    if (process) break;
  }

  const setProperty = <K extends keyof StageProcess>(key: K, value: StageProcess[K]) => {
    setCaseMap(old => {
      const newCaseMap: CaseMap = structuredClone(old);
      for (const stage of newCaseMap.stages) {
        const procIdx = stage.processes?.findIndex(p => p.id === selectedElement.id) ?? -1;
        if (procIdx !== -1 && stage.processes && stage.processes[procIdx]) {
          stage.processes[procIdx][key] = value;
          return newCaseMap;
        }
        const sideIdx = stage.sidesteps?.findIndex(s => s.id === selectedElement.id) ?? -1;
        if (sideIdx !== -1 && stage.sidesteps && stage.sidesteps[sideIdx]) {
          stage.sidesteps[sideIdx][key] = value;
          return newCaseMap;
        }
      }
      return newCaseMap;
    });
  };

  return { process, setProperty };
};

export const usePreConditionProperty = () => {
  const { caseMap, setCaseMap, selectedElement } = useAppContext();

  if (!selectedElement || selectedElement.type !== 'process') {
    return { preCondition: undefined, setProperty: () => {} };
  }

  let preCondition: ProcessPreCondition | undefined;

  for (const stage of caseMap.stages) {
    const proc = stage.processes?.find(p => p.id === selectedElement.id);
    if (proc) {
      preCondition = proc.preCondition;
      break;
    }
    const side = stage.sidesteps?.find(s => s.id === selectedElement.id);
    if (side) {
      preCondition = side.preCondition;
      break;
    }
  }

  const setProperty = <K extends keyof ProcessPreCondition>(key: K, value: ProcessPreCondition[K]) => {
    setCaseMap(old => {
      const newCaseMap: CaseMap = structuredClone(old);
      for (const stage of newCaseMap.stages) {
        const procIdx = stage.processes?.findIndex(p => p.id === selectedElement.id) ?? -1;
        if (procIdx !== -1 && stage.processes && stage.processes[procIdx]) {
          stage.processes[procIdx].preCondition = {
            ...(stage.processes[procIdx].preCondition ?? { script: '', label: '' }),
            [key]: value
          };
          return newCaseMap;
        }
        const sideIdx = stage.sidesteps?.findIndex(s => s.id === selectedElement.id) ?? -1;
        if (sideIdx !== -1 && stage.sidesteps && stage.sidesteps[sideIdx]) {
          stage.sidesteps[sideIdx].preCondition = {
            ...(stage.sidesteps[sideIdx].preCondition ?? { script: '', label: '' }),
            [key]: value
          };
          return newCaseMap;
        }
      }
      return newCaseMap;
    });
  };

  return { preCondition, setProperty };
};
