import type { CaseMapModel } from '@axonivy/case-map-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { findElementById as findElementByIdHelper, modifyData, type ElementType } from '../data/data';

export const useCaseMapData = () => {
  const { caseMap, setCaseMap, selectedElement, setSelectedElement, setDetail } = useAppContext();

  const deleteElementById = (id: string, type: ElementType) => {
    setCaseMap((old: CaseMapModel) => modifyData(old, { type: 'remove', data: { id } }).newData);

    if (selectedElement?.id === id && selectedElement?.type === type) {
      setSelectedElement(undefined);
      setDetail(false);
    }
  };

  const moveElement = (id: string, direction: 'moveUp' | 'moveDown') => {
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, { type: direction, data: { id } }).newData;
    });
  };

  const moveElementAfter = (id: string, targetId: string, type: ElementType) => {
    setCaseMap((old: CaseMapModel) => {
      return modifyData(old, { type: 'dnd', data: { activeId: id, targetId, type } }).newData;
    });
  };

  const findElementById = (id: string) => {
    return findElementByIdHelper(caseMap, id);
  };

  return { deleteElementById, moveElement, moveElementAfter, findElementById };
};
