import { Link } from "react-router-dom";
import { useClients } from "../api/clients";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import ListPage from "../components/ListPage";
import ClientCard from "../components/ClientCard";

const Clients = () => {
  const { user } = useAuth();
  const { data: clients, isLoading } = useClients();
  const canEdit = isStaff(user);

  return (
    <ListPage
      title="Clients"
      items={clients}
      isLoading={isLoading}
      searchKeys={["name", "status", "server", "platform"]}
      newLink={canEdit && { to: "/clients/new", label: "Add client" }}
      emptyText="No clients at the moment"
    >
      {(page) =>
        page.map((client) =>
          canEdit ? (
            <Link
              key={client.id}
              to={`/clients/${client.id}/edit`}
              className="w-full lg:w-1/3 mx-auto"
            >
              <ClientCard client={client} />
            </Link>
          ) : (
            <div key={client.id} className="w-full lg:w-1/3 mx-auto">
              <ClientCard client={client} />
            </div>
          ),
        )
      }
    </ListPage>
  );
};

export default Clients;
