import type { CaseMap, CaseMapEditorDataContext } from './editor';

export type EditorProps = { context: CaseMapEditorDataContext };

export interface Client {
  data(context: CaseMapEditorDataContext): Promise<CaseMap>;
}

export interface ClientContext {
  client: Client;
}
