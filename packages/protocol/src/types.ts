import type { CaseMap, CaseMapEditorDataContext } from './editor';

export type EditorProps = { context: CaseMapEditorDataContext };
type SaveArgs = { pmv: string; caseMapUuid: string; model: CaseMap };

export interface Client {
  data(context: CaseMapEditorDataContext): Promise<CaseMap>;
  saveData(saveArgs: SaveArgs): Promise<unknown>;
}

export interface ClientContext {
  client: Client;
}
