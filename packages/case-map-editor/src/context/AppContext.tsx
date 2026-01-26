import type { CaseMapContext, CaseMapModel } from '@axonivy/case-map-editor-protocol';
import type { UpdateConsumer, useHistoryData } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

export type SelectedElement = { id: string; type: 'stage' | 'process' };

type AppContext = {
  caseMap: CaseMapModel;
  setCaseMap: UpdateConsumer<CaseMapModel>;
  selectedElement?: SelectedElement;
  setSelectedElement: (element?: SelectedElement) => void;
  history: ReturnType<typeof useHistoryData<CaseMapModel>>;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  context: CaseMapContext;
  helpUrl: string;
};

const appContext = createContext<AppContext>({
  caseMap: {} as CaseMapModel,
  setCaseMap: () => {},
  detail: true,
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  setSelectedElement: () => {},
  setDetail: () => {},
  context: { app: '', file: '', pmv: '' },
  helpUrl: ''
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext & { setUnhistoriedVariables: UpdateConsumer<CaseMapModel> } => {
  const context = useContext(appContext);
  return {
    ...context,
    setCaseMap: updateData => {
      context.setCaseMap(old => {
        const newData = updateData(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistoriedVariables: context.setCaseMap
  };
};
