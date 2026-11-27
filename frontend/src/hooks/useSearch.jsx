import { useState, useMemo, useRef } from "react";

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const normalize = (str) => str.toLowerCase().replace(/_/g, " ");

// Filters `data` by `query` across the given keys (dot paths allowed, e.g.
// "user.username"). Filters as you type.
const useSearch = (data, keys) => {
  const [query, setQuery] = useState("");
  const keysRef = useRef(keys);

  // Kept for callers that still trigger search explicitly; filtering is live.
  const handleSearch = () => {};

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return data;
    return data.filter((item) =>
      keysRef.current.some((key) =>
        normalize(String(getNestedValue(item, key) ?? "")).includes(q),
      ),
    );
  }, [data, query]);

  return { query, setQuery, filtered, handleSearch };
};

export default useSearch;
