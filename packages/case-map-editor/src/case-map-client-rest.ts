import type { CaseMap, CaseMapEditorDataContext, Client } from '@axonivy/case-map-editor-protocol';
import { getCaseMapModel1, setCaseMapModel, type CaseMapModelRestServiceModel, type setCaseMapModelResponse } from './data/ivy-client';

export class CaseMapClientRest implements Client {
  async data(context: CaseMapEditorDataContext): Promise<CaseMap> {
    const rawData = getCaseMapModel1(context.pmv, context.uuid);
    const modelJson = ((await rawData).data as CaseMapModelRestServiceModel).model ?? '{}';
    const caseMapModel = JSON.parse(modelJson);
    return caseMapModel;
  }
  async saveData(saveArgs: { pmv: string; caseMapUuid: string; model: CaseMap }): Promise<setCaseMapModelResponse> {
    const modelString = JSON.stringify(saveArgs.model);
    const restModel: CaseMapModelRestServiceModel = { model: modelString };
    return setCaseMapModel(saveArgs.pmv, saveArgs.caseMapUuid, restModel);
  }
}
