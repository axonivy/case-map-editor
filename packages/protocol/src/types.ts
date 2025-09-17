/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { CaseMapClient } from './case-map-client';
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

export interface ClientContext {
  client: CaseMapClient;
}

export interface RequestTypes extends MetaRequestTypes {
  initialize: [CaseMapEditorDataContext, boolean];
  data: [CaseMapEditorDataContext, CaseMapModel];
  saveData: [CaseMapEditorSaveArgs, CaseMapModel];
}

export interface MetaRequestTypes {
  'meta/processes': [CaseMapEditorProcessContext, Array<ProcessStart>];
  'meta/metrics': [CaseMapEditorDataContext, Array<ProcessMetrics>];
}

export interface CaseMapNotificationTypes {
  animate: void;
}
