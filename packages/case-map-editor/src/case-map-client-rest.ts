import type { CaseMap, CaseMapEditorDataContext, Client } from '@axonivy/case-map-editor-protocol';
import { getCaseMapModel1, type CaseMapModelRestServiceModel } from './data/ivy-client';

export class CaseMapClientRest implements Client {
  async data(context: CaseMapEditorDataContext): Promise<CaseMap> {
    const rawData = getCaseMapModel1(context.pmv, context.uuid);
    const modelJson = ((await rawData).data as CaseMapModelRestServiceModel).model ?? '{}';
    const caseMapModel = JSON.parse(modelJson);
    return caseMapModel;
  }
}
