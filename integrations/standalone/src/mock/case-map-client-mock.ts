/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CaseMapContext, CaseMapEditorData, EditorFileContent, MetaRequestTypes, SaveArgs } from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
import { Emitter } from '@axonivy/jsonrpc';
import { data } from './data.mock';

export class CaseMapClientMock implements CaseMapClient {
  protected onAnimateEmitter = new Emitter<void>();
  onAnimate = this.onAnimateEmitter.event;

  initialize(context: CaseMapContext): Promise<boolean> {
    return Promise.resolve(true);
  }
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    throw new Error('Method not implemented.');
  }

  private caseMapData: CaseMapEditorData = {
    context: { app: 'mock', pmv: 'mock', file: 'mock.f.json' },
    readonly: false,
    data: data,
    baseUrl: '',
    helpUrl: 'https://dev.axonivy.com'
  };

  data(context: CaseMapContext): Promise<CaseMapEditorData> {
    return Promise.resolve(this.caseMapData);
  }
  saveData(saveData: SaveArgs): Promise<EditorFileContent> {
    this.caseMapData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }
}
