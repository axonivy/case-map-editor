// prettier-ignore

export interface CaseMapEditorDataContext {
  app: string;
  file: string;
  pmv: string;
}

export interface CaseMapData {
  context: CaseMapEditorDataContext;
  data: CaseMap;
  helpUrl: string;
}

export interface CaseMap {
  uuid: string;
  id: string;
  name: string;
  description?: string;
  stages: Stage[];
}

export interface Stage {
  _key: string;
  id: string;
  name?: string;
  icon?: string;
  isTerminating?: boolean;
  description?: string;
  processes?: StageProcess[];
  sidesteps?: StageProcess[];
}

export interface StageProcess {
  _key: string;
  id: string;
  name?: string;
  description?: string;
  preCondition?: ProcessPreCondition;
  processToExecute?: string;
}

export interface ProcessPreCondition {
  script: string;
  label: string;
}
