import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";
import Loading from "./Loading";
import usePagination from "../hooks/usePagination";
import useSearch from "../hooks/useSearch";

// Stable fallback, so pagination isn't reset on every render while loading.
const NO_ITEMS = [];

// Header with search and an optional "new" link, a paginated body, and an
// empty state. `children` receives the items on the current page.
const ListPage = ({
  title,
  items = NO_ITEMS,
  searchKeys,
  pageSize = 5,
  isLoading,
  newLink,
  emptyText = "Nothing here yet.",
  children,
}) => {
  const { query, setQuery, filtered, handleSearch } = useSearch(
    items,
    searchKeys,
  );
  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    pageSize,
  );

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="relative flex flex-col md:flex-row justify-between items-start gap-1 lg:items-center border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        <SearchInput value={query} onChange={setQuery} onSearch={handleSearch} />
        {newLink && (
          <Link
            className="border border-primary rounded-md text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150 text-sm"
            to={newLink.to}
          >
            {newLink.label}
          </Link>
        )}
      </div>
      <div className="flex flex-col flex-1 justify-start gap-2 py-6">
        {currentItems.length === 0 ? (
          <h2 className="text-2xl font-bold text-center">{emptyText}</h2>
        ) : (
          children(currentItems)
        )}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default ListPage;
