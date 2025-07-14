import type { CaseMapEditorDataContext } from './editor';

export type EditorProps = { context: CaseMapEditorDataContext };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Client {}

export interface ClientContext {
  client: Client;
}
