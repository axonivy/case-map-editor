import type { CaseMapEditorDataContext, CaseMapModel } from '@axonivy/case-map-editor-protocol';
import type { UpdateConsumer } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

export type SelectedElement = { id: string; type: 'stage' | 'process' };

type AppContext = {
  caseMap: CaseMapModel;
  setCaseMap: UpdateConsumer<CaseMapModel>;
  selectedElement?: SelectedElement;
  setSelectedElement: (element?: SelectedElement) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  context: CaseMapEditorDataContext;
};

const appContext = createContext<AppContext>({
  caseMap: {} as CaseMapModel,
  setCaseMap: () => {},
  detail: true,
  setSelectedElement: () => {},
  setDetail: () => {},
  context: { app: '', file: '', pmv: '' }
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext => {
  return useContext(appContext);
};
