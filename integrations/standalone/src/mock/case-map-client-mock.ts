/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CaseMapEditorDataContext, CaseMapModel, MetaRequestTypes, SaveArgs } from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
import { Emitter } from '@axonivy/jsonrpc';
import { data } from './data.mock';

export class CaseMapClientMock implements CaseMapClient {
  protected onAnimateEmitter = new Emitter<void>();
  onAnimate = this.onAnimateEmitter.event;

  initialize(context: CaseMapEditorDataContext): Promise<boolean> {
    return Promise.resolve(true);
  }
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    throw new Error('Method not implemented.');
  }

  private caseMap: CaseMapModel = data;

  data(context: CaseMapEditorDataContext): Promise<CaseMapModel> {
    return Promise.resolve(this.caseMap);
  }
  saveData(saveData: SaveArgs): Promise<CaseMapModel> {
    this.caseMap = saveData.model;
    return Promise.resolve(this.caseMap);
  }
}
