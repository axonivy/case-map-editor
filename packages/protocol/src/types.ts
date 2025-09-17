import type {
  CaseMapEditorDataContext,
  CaseMapEditorProcessContext,
  CaseMapEditorSaveArgs,
  CaseMapModel,
  ProcessMetrics,
  ProcessStart
} from './editor';

export type EditorProps = { context: CaseMapEditorDataContext; directSave?: boolean };
export type SaveArgs = CaseMapEditorSaveArgs & { directSave?: boolean };

export interface Client {
  data(context: CaseMapEditorDataContext): Promise<CaseMapModel>;
  saveData(saveData: SaveArgs): Promise<CaseMapModel>;
}

export interface ClientContext {
  client: Client;
}

export interface RequestTypes extends MetaRequestTypes {
  data: [CaseMapEditorDataContext, CaseMapModel];
  saveData: [CaseMapEditorSaveArgs, CaseMapModel];
}

export interface MetaRequestTypes {
  'meta/processes': [CaseMapEditorProcessContext, Array<ProcessStart>];
  'meta/metrics': [CaseMapEditorDataContext, Array<ProcessMetrics>];
}
