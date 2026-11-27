import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone } from "lucide-react";
import FeaturesCard from "../components/FeaturesCard";
import useAuth from "../hooks/useAuth";
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

const NewFeatures = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";
  const { query, setQuery, filtered } = useSearch(features, [
    "title",
    "description",
    "user.username",
  ]);

  useEffect(() => {
    const getPubFeatures = async () => {
      try {
        const pubFeatures = await axios.get(`${BACKEND_URL}/features/all`, {
          withCredentials: true,
        });
        setFeatures(pubFeatures.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getPubFeatures();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    9,
  );

  return (
    <Page>
      <PageHeader
        icon={Megaphone}
        title="Features"
        description="What's new and what's coming to the platform."
        actions={
          canEdit && <NewButton to="/features/new">New feature</NewButton>
        }
      />
      <ListToolbar
        search={
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search features…"
          />
        }
        count={filtered.length}
        noun="feature"
      />

      {loading ? (
        <SkeletonGrid />
      ) : currentItems.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={
            query ? "No features match your search" : "No features announced yet"
          }
          action={
            !query &&
            canEdit && (
              <NewButton to="/features/new">Announce a feature</NewButton>
            )
          }
        />
      ) : (
        <CardGrid>
          {currentItems.map((feature) => (
            <FeaturesCard key={feature.id} feature={feature} />
          ))}
        </CardGrid>
      )}

      <Pager pageCount={pageCount} onPageChange={handlePageChange} />
    </Page>
  );
};

export default NewFeatures;
