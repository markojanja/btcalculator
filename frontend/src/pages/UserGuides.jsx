import axios from "axios";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import GuidesCard from "../components/GuidesCard";
import usePagination from "../hooks/usePagination";
import useSearch from "../hooks/useSearch";
import {
  CardGrid,
  EmptyState,
  ListToolbar,
  NewButton,
  Page,
  PageHeader,
  Pager,
  SearchBox,
  SkeletonGrid,
} from "../components/PageUI";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filtered } = useSearch(guides, [
    "title",
    "description",
    "user.username",
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/guides`, {
          withCredentials: true,
        });
        setGuides(response.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    9,
  );

  return (
    <Page>
      <PageHeader
        icon={BookOpen}
        title="Guides"
        description="How-tos and procedures written by the team."
        actions={<NewButton to="/guides/new">New guide</NewButton>}
      />
      <ListToolbar
        search={
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search guides…"
          />
        }
        count={filtered.length}
        noun="guide"
      />

      {loading ? (
        <SkeletonGrid />
      ) : currentItems.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={query ? "No guides match your search" : "No guides yet"}
          action={
            !query && <NewButton to="/guides/new">Write the first guide</NewButton>
          }
        />
      ) : (
        <CardGrid>
          {currentItems.map((guide) => (
            <GuidesCard key={guide.id} guide={guide} />
          ))}
        </CardGrid>
      )}

      <Pager pageCount={pageCount} onPageChange={handlePageChange} />
    </Page>
  );
};

export default UserGuides;
