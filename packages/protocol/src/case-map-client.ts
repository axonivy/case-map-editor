import type { CaseMapContext, CaseMapEditorData, EditorFileContent } from './editor';
import type { CaseMapActionArgs, MetaRequestTypes, SaveArgs } from './types';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface CaseMapClient {
  initialize(context: CaseMapContext): Promise<boolean>;
  data(context: CaseMapContext): Promise<CaseMapEditorData>;
  saveData(args: SaveArgs): Promise<EditorFileContent>;

  action(action: CaseMapActionArgs): void;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
}
