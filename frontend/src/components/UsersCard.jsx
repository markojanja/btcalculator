import "./UsersCard.css";

const UsersCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="card-header">
        <h4>
          {user.firstname} {user.lastname}
        </h4>
      </div>
      <div>
        <p>{user.email}</p>
        <p>{user.username}</p>
        <p>{user.role}</p>
        <p>{user?.active ? "active" : "inactive"}</p>
        <p>{user.createdAt}</p>
      </div>
    </div>
  );
};

export default UsersCard;
