import { customFetch } from './custom-fetch';
export interface CaseMapModelRestServiceModel {
  processModelName?: string;
  immutable?: boolean;
  model?: string;
}

export type GetProcessesParams = {
  projectname?: string;
};

export type getCaseMapModel1ResponseDefault = {
  data: unknown;
  status: number;
};

export type getCaseMapModel1ResponseComposite = getCaseMapModel1ResponseDefault;

export type getCaseMapModel1Response = getCaseMapModel1ResponseComposite & {
  headers: Headers;
};

export const getGetCaseMapModel1Url = (pmv: string, caseMapUuid: string) => {
  return `/internal/casemapui/${pmv}/${caseMapUuid}/model`;
};

export const getCaseMapModel1 = async (pmv: string, caseMapUuid: string, options?: RequestInit): Promise<getCaseMapModel1Response> => {
  return customFetch<getCaseMapModel1Response>(getGetCaseMapModel1Url(pmv, caseMapUuid), {
    ...options,
    method: 'GET'
  });
};

export type setCaseMapModelResponseDefault = {
  data: unknown;
  status: number;
};

export type setCaseMapModelResponseComposite = setCaseMapModelResponseDefault;

export type setCaseMapModelResponse = setCaseMapModelResponseComposite & {
  headers: Headers;
};

export const getSetCaseMapModelUrl = (pmv: string, caseMapUuid: string) => {
  return `/internal/casemapui/${pmv}/${caseMapUuid}/model`;
};

export const setCaseMapModel = async (
  pmv: string,
  caseMapUuid: string,
  caseMapModelRestServiceModel: CaseMapModelRestServiceModel,
  options?: RequestInit
): Promise<setCaseMapModelResponse> => {
  return customFetch<setCaseMapModelResponse>(getSetCaseMapModelUrl(pmv, caseMapUuid), {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': '*/*', ...options?.headers },
    body: JSON.stringify(caseMapModelRestServiceModel)
  });
};

export type getMetrics1ResponseDefault = {
  data: unknown;
  status: number;
};

export type getMetrics1ResponseComposite = getMetrics1ResponseDefault;

export type getMetrics1Response = getMetrics1ResponseComposite & {
  headers: Headers;
};

export const getGetMetrics1Url = (pmv: string, mapId: string) => {
  return `/internal/casemapui/${pmv}/${mapId}/metrics`;
};

export const getMetrics1 = async (pmv: string, mapId: string, options?: RequestInit): Promise<getMetrics1Response> => {
  return customFetch<getMetrics1Response>(getGetMetrics1Url(pmv, mapId), {
    ...options,
    method: 'GET'
  });
};

export type getProcessesResponseDefault = {
  data: unknown;
  status: number;
};

export type getProcessesResponseComposite = getProcessesResponseDefault;

export type getProcessesResponse = getProcessesResponseComposite & {
  headers: Headers;
};

export const getGetProcessesUrl = (params?: GetProcessesParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/internal/casemapui/process?${stringifiedParams}` : `/internal/casemapui/process`;
};

export const getProcesses = async (params?: GetProcessesParams, options?: RequestInit): Promise<getProcessesResponse> => {
  return customFetch<getProcessesResponse>(getGetProcessesUrl(params), {
    ...options,
    method: 'GET'
  });
};
