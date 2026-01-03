import { useState, useMemo } from "react";

const usePagination = (items = [], itemsPerPage = 10) => {
  const [itemOffset, setItemOffset] = useState(0);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage;
    return items.slice(itemOffset, endOffset);
  }, [items, itemOffset, itemsPerPage]);

  const handlePageChange = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const resetPagination = () => setItemOffset(0);

  return {
    currentItems,
    pageCount,
    handlePageChange,
    resetPagination,
  };
};

export default usePagination;
