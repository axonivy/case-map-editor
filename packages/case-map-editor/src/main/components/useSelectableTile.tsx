import { useReadonly } from '@axonivy/ui-components';
import type { KeyboardEvent } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useCaseMapData } from '../useCaseMapData';

type TileType = 'stage' | 'process';

export const useSelectableTile = (id: string, type: TileType) => {
  const { detail, selectedElement, setSelectedElement, setDetail } = useAppContext();
  const { deleteElementById, moveElement } = useCaseMapData();
  const readonly = useReadonly();
  const isSelected = selectedElement?.id === id && selectedElement?.type === type;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({ id, type });
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetail(!detail);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (/^\d$/.test(e.key)) {
      return;
    }
    e.stopPropagation();
    if (e.key === 'Enter') {
      setSelectedElement({ id, type });
      setDetail(!detail);
    }
    if (readonly) return;
    if (e.key === 'Delete') {
      deleteElementById(id, type);
    }
    if (type === 'process') {
      if (e.key === 'ArrowUp') moveElement(id, 'moveUp');
      if (e.key === 'ArrowDown') moveElement(id, 'moveDown');
    } else if (type === 'stage') {
      if (e.key === 'ArrowLeft') moveElement(id, 'moveUp');
      if (e.key === 'ArrowRight') moveElement(id, 'moveDown');
    }
  };

  return { isSelected, onClick, onDoubleClick, onKeyDown };
};
