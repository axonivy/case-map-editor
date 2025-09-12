import type { CaseMap, CaseMapEditorDataContext, Client } from '@axonivy/case-map-editor-protocol';
import { data } from './data.mock';

export class CaseMapClientMock implements Client {
  private caseMap: CaseMap = data;

  saveData(saveArgs: { pmv: string; caseMapUuid: string; model: CaseMap }): Promise<unknown> {
    this.caseMap = saveArgs.model;
    return Promise.resolve({ content: '' });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data(context: CaseMapEditorDataContext): Promise<CaseMap> {
    return Promise.resolve(this.caseMap);
  }
}
