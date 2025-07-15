import type { CaseMap } from '@axonivy/case-map-editor-protocol';
import { createContext, useContext } from 'react';

type AppContext = {
  caseMap: CaseMap;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  caseMap: {} as CaseMap,
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
