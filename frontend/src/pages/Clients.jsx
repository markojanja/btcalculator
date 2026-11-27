import axios from "axios";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import usePagination from "../hooks/usePagination";
import useAuth from "../hooks/useAuth";
import useSearch from "../hooks/useSearch";
import ClientCard from "../components/ClientCard";
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

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";

  const { query, setQuery, filtered } = useSearch(clients, [
    "name",
    "status",
    "server",
    "platform",
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/clients`, {
          withCredentials: true,
        });
        setClients(response.data);
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
        icon={Building2}
        title="Clients"
        description="Brokers we support, with their servers and platforms."
        actions={canEdit && <NewButton to="/clients/new">New client</NewButton>}
      />
      <ListToolbar
        search={
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search name, status, server…"
          />
        }
        count={filtered.length}
        noun="client"
      />

      {loading ? (
        <SkeletonGrid />
      ) : currentItems.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={query ? "No clients match your search" : "No clients yet"}
          description={query ? "Try a different name or server." : undefined}
        />
      ) : (
        <CardGrid>
          {currentItems.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              to={canEdit ? `/clients/${client.id}/edit` : undefined}
            />
          ))}
        </CardGrid>
      )}

      <Pager pageCount={pageCount} onPageChange={handlePageChange} />
    </Page>
  );
};

export default Clients;
