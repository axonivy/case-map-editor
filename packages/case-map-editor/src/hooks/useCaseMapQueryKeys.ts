import { type CaseMapContext } from '@axonivy/case-map-editor-protocol';
import { useMemo } from 'react';
import { genQueryKey } from '../query/query-client';

export function useCaseMapQueryKeys() {
  return useMemo(() => {
    return {
      data: (context: CaseMapContext) => genQueryKey('data', context),
      saveData: (context: CaseMapContext) => genQueryKey('saveData', context)
    };
  }, []);
}
