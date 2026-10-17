import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, clientsKeys, useClient } from "../api/clients";
import FormCard from "../components/form/FormCard";
import ClientForm from "../components/form/ClientForm";
import Loading from "../components/Loading";

// /clients/new and /clients/:id/edit
const ClientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: client, isLoading } = useClient(id);

  const save = useMutation({
    mutationFn: (values) =>
      id ? clientsApi.update(id, values) : clientsApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
      navigate("/clients");
    },
  });

  if (id && isLoading) return <Loading />;

  return (
    <FormCard
      title={id ? "Edit client" : "New client"}
      backTo="/clients"
      backLabel="Back to clients"
    >
      <ClientForm
        // Clients are stored with a list of servers; the form edits one.
        initialValues={client && { ...client, server: client.server[0] ?? "" }}
        onSubmit={save.mutate}
        pending={save.isPending}
      />
    </FormCard>
  );
};

export default ClientFormPage;
