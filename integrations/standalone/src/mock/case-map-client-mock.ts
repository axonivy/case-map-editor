import type { CaseMap, CaseMapEditorDataContext, Client } from '@axonivy/case-map-editor-protocol';
import { data } from './data.mock';

export class CaseMapClientMock implements Client {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data(context: CaseMapEditorDataContext): Promise<CaseMap> {
    return Promise.resolve(data);
  }
}
