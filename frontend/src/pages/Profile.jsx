import "./Profile.css";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="profile-card">
        <h2>Full Name</h2>
        <h3>
          {user?.firstname} {user?.lastname}
        </h3>
        <h2>Email</h2>
        <h3>{user?.email}</h3>
        <h2>Username</h2>
        <h3>{user?.username}</h3>
        <h2>Role</h2>
        <h3>{user?.role}</h3>
        <h2>Status</h2>
        <h3>{user?.active === true ? "active" : "inactive"}</h3>
      </div>
    </div>
  );
};

export default Profile;
