import ReactPaginate from "react-paginate";

const Pagination = ({
  pageCount,
  onPageChange,
  pageRangeDisplayed = 5,
  className = "pagination",
}) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      containerClassName={className}
      activeClassName="active"
    />
  );
};

export default Pagination;
