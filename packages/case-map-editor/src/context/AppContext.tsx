import type { CaseMap } from '@axonivy/case-map-editor-protocol';
import type { UpdateConsumer } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

export type SelectedElement = { id: string; type: 'stage' | 'process' };

type AppContext = {
  caseMap: CaseMap;
  setCaseMap: UpdateConsumer<CaseMap>;
  selectedElement?: SelectedElement;
  setSelectedElement: (element?: SelectedElement) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  caseMap: {} as CaseMap,
  setCaseMap: () => {},
  detail: true,
  setSelectedElement: () => {},
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
