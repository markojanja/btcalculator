import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, usersKeys, useUser } from "../api/users";
import FormCard from "../components/form/FormCard";
import UserForm from "../components/form/UserForm";
import Loading from "../components/Loading";

// /users/add and /users/edit/:id
const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser(id);

  const save = useMutation({
    mutationFn: (values) =>
      id ? usersApi.update(id, values) : usersApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      navigate("/users");
    },
  });

  if (id && isLoading) return <Loading />;

  return (
    <FormCard
      title={id ? "Edit user" : "New user"}
      backTo="/users"
      backLabel="Back to users"
    >
      <UserForm
        initialValues={user}
        isNew={!id}
        onSubmit={save.mutate}
        pending={save.isPending}
      />
    </FormCard>
  );
};

export default UserFormPage;
