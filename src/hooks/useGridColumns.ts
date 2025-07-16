import { useState, useEffect, useRef, RefObject } from 'react';

interface UseGridColumnsReturn {
  gridColumns: number;
  gridRef: RefObject<HTMLDivElement>;
}

export const useGridColumns = (minCardWidth: number = 300): UseGridColumnsReturn => {
  const [gridColumns, setGridColumns] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const updateGridColumns = () => {
      if (!gridRef.current) return;
      const gridWidth = gridRef.current.getBoundingClientRect().width;
      const newColumns = Math.floor(gridWidth / minCardWidth);
      setGridColumns(Math.max(1, newColumns));
    };

    const resizeObserver = new ResizeObserver(updateGridColumns);
    resizeObserver.observe(gridRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [minCardWidth]);

  return {
    gridColumns,
    gridRef
  };
};
