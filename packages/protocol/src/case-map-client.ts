import type { CaseMapEditorDataContext, CaseMapModel } from './editor';
import type { MetaRequestTypes, SaveArgs } from './types';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface CaseMapClient {
  initialize(context: CaseMapEditorDataContext): Promise<boolean>;
  data(context: CaseMapEditorDataContext): Promise<CaseMapModel>;
  saveData(args: SaveArgs): Promise<CaseMapModel>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;

  onAnimate: Event<void>;
}
