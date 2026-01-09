/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { CaseMapClient } from './case-map-client';
import type {
  CaseMapContext,
  CaseMapEditorData,
  CaseMapEditorProcessContext,
  CaseMapEditorSaveArgs,
  CaseMapModel,
  EditorFileContent,
  ProcessStart
} from './editor';

export type EditorProps = { context: CaseMapContext; directSave?: boolean };
export type SaveArgs = CaseMapEditorSaveArgs & { directSave?: boolean };
export type CaseMapEditor = Omit<CaseMapEditorData, 'data'> & {
  data: CaseMapModel;
};

export interface ClientContext {
  client: CaseMapClient;
}

export interface RequestTypes extends MetaRequestTypes {
  initialize: [CaseMapContext, boolean];
  data: [CaseMapContext, CaseMapEditorData];
  saveData: [CaseMapEditorSaveArgs, EditorFileContent];
}

export interface MetaRequestTypes {
  'meta/processes': [CaseMapEditorProcessContext, Array<ProcessStart>];
}

export interface CaseMapNotificationTypes {
  animate: void;
}
