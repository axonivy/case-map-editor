import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getCaseMapModel1,
  getMetrics1,
  getProcesses,
  setCaseMapModel,
  type CaseMapModelRestServiceModel,
  type GetProcessesParams
} from './data/ivy-client';

export const useGetCaseMapModel = (pmv: string, caseMapUuid: string) => {
  return useQuery({
    queryKey: ['caseMapModel', pmv, caseMapUuid],
    queryFn: () => getCaseMapModel1(pmv, caseMapUuid),
    enabled: !!pmv && !!caseMapUuid
  });
};

export const useSetCaseMapModel = () => {
  return useMutation({
    mutationFn: ({ pmv, caseMapUuid, model }: { pmv: string; caseMapUuid: string; model: CaseMapModelRestServiceModel }) =>
      setCaseMapModel(pmv, caseMapUuid, model)
  });
};

export const useGetMetrics = (pmv: string, mapId: string) => {
  return useQuery({
    queryKey: ['metrics', pmv, mapId],
    queryFn: () => getMetrics1(pmv, mapId),
    enabled: !!pmv && !!mapId
  });
};

export const useGetProcesses = (params?: GetProcessesParams) => {
  return useQuery({
    queryKey: ['processes', params],
    queryFn: () => getProcesses(params),
    enabled: !!params?.projectname
  });
};
