/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CaseMapEditorDataContext, CaseMapModel, Client, SaveArgs } from '@axonivy/case-map-editor-protocol';
import { data } from './data.mock';

export class CaseMapClientMock implements Client {
  private caseMap: CaseMapModel = data;

  data(context: CaseMapEditorDataContext): Promise<CaseMapModel> {
    return Promise.resolve(this.caseMap);
  }
  saveData(saveData: SaveArgs): Promise<CaseMapModel> {
    this.caseMap = saveData.model;
    return Promise.resolve(this.caseMap);
  }
}
