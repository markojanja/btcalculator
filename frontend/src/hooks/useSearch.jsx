import { useState, useMemo, useRef } from "react";

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const normalize = (str) => str.toLowerCase().replace(/_/g, " ");

const useSearch = (data, keys) => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const keysRef = useRef(keys);

  const handleSearch = () => {
    setSubmittedQuery(query);
  };

  const filtered = useMemo(
    () =>
      data.filter((item) =>
        keysRef.current.some((key) =>
          normalize(String(getNestedValue(item, key) ?? "")).includes(
            normalize(submittedQuery),
          ),
        ),
      ),
    [data, submittedQuery],
  );

  return { query, setQuery, filtered, handleSearch };
};

export default useSearch;
