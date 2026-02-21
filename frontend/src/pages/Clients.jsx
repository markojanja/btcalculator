import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useAuth from "../hooks/useAuth";
import ClientCard from "../components/ClientCard";

const Clients = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/clients`, {
          withCredentials: true,
        });
        setClients(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const { currentItems, pageCount, handlePageChange } = usePagination(
    clients,
    5,
  );

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Clients List</h2>
        {canEdit && (
          <Link
            className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
            style={{ borderRadius: "8px" }}
            to="/clients/new"
          >
            Add Client
          </Link>
        )}
      </div>
      <div className="flex flex-col justify-start gap-2 py-6">
        {currentItems && currentItems?.length > 0 ? (
          currentItems.map((client) =>
            canEdit ? (
              <Link key={client.id} to={`${client.id}/edit`}>
                <ClientCard client={client} />
              </Link>
            ) : (
              <div key={client.id}>
                <ClientCard client={client} />
              </div>
            ),
          )
        ) : (
          <h2>No clients at the moment!</h2>
        )}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default Clients;
