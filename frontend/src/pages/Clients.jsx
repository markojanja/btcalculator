import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Clients = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/clients`, {
          withCredentials: true,
        });
        console.log(response.data);
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
        <Link
          className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150"
          style={{ borderRadius: "8px" }}
          to="/clients/new"
        >
          Add Client
        </Link>
      </div>
      <div className="flex flex-col justify-start gap-2 py-6">
        {currentItems && currentItems?.length > 0 ? (
          currentItems.map((client) => (
            <Link key={client.id} to={`${client.id}/edit`}>
              <Card
                className={"w-1/3 text-left items-start justify-start mx-auto"}
              >
                <CardContent className={"w-full"}>
                  <CardTitle className={"mb-2"}>
                    <h3 className="text-lg">{client.name}</h3>
                  </CardTitle>
                  <Separator className={"w-full mb-2"} />
                  <p>Status:</p>
                  <Badge variant="secondary">{client.status}</Badge>

                  <p>Server:</p>
                  <Badge className="bg-purple-300 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {client.server[0]}
                  </Badge>
                  <p>Platform:</p>

                  {client.platform.map((p) => (
                    <Badge className={"mr-1.5"} key={p}>
                      {p}
                    </Badge>
                  ))}
                  <p>Added: {client.user.username}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <h2>No clients at the moment!</h2>
        )}
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default Clients;
