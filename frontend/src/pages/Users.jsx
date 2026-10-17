import { useUsers } from "../api/users";
import ListPage from "../components/ListPage";
import UsersCard from "../components/UsersCard";

const Users = () => {
  const { data: users, isLoading } = useUsers();

  return (
    <ListPage
      title="Users"
      items={users}
      isLoading={isLoading}
      searchKeys={["firstname", "lastname", "username"]}
      pageSize={4}
      newLink={{ to: "/users/add", label: "New user" }}
      emptyText="No users found"
    >
      {(page) => page.map((user) => <UsersCard key={user.id} user={user} />)}
    </ListPage>
  );
};

export default Users;
