import type { CaseMap } from '@axonivy/case-map-editor-protocol';
import { createContext, useContext } from 'react';

type AppContext = {
  caseMap: CaseMap;
  selectedElement?: string;
  setSelectedElement: (element?: string) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  caseMap: {} as CaseMap,
  setSelectedElement: () => {},
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
