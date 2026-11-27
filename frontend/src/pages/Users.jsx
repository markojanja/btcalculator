import axios from "axios";
import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import UsersCard from "../components/UsersCard";
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, setQuery, filtered } = useSearch(users, [
    "firstname",
    "lastname",
    "username",
    "email",
    "role",
  ]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/users/all`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    9,
  );

  return (
    <Page>
      <PageHeader
        icon={UsersIcon}
        title="Users"
        description="Everyone with access to CSBoard."
        actions={<NewButton to="/users/add">New user</NewButton>}
      />
      <ListToolbar
        search={
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search name, username, email…"
          />
        }
        count={filtered.length}
        noun="user"
      />

      {loading ? (
        <SkeletonGrid />
      ) : currentItems.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={query ? "No users match your search" : "No users yet"}
          description={query ? "Try a different name or email." : undefined}
        />
      ) : (
        <CardGrid>
          {currentItems.map((user) => (
            <UsersCard key={user.id} user={user} />
          ))}
        </CardGrid>
      )}

      <Pager pageCount={pageCount} onPageChange={handlePageChange} />
    </Page>
  );
};

export default Users;
