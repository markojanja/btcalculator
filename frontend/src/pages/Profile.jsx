import "./Profile.css";
import useAuth from "../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";

const Profile = () => {
  const { user } = useAuth();

  const role = user.role;

  return (
    <div className="profile">
      <div className="profile-card">
        <div className="profile-icon">
          <FaUserCircle />
        </div>
        <div className="profile-info-wrapper">
          <h1>
            {user?.firstname} {user?.lastname}
          </h1>
          <div className="profile-info-group">
            <MdOutlineEmail />
            <h3>{user?.email}</h3>
          </div>

          <div className="profile-info-group">
            <FaUserCircle />
            <h3>{user?.username}</h3>
          </div>
          <div className="profile-info-group">
            <IoBriefcase />
            <h3>{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</h3>
          </div>
          <div className="profile-info-group">
            {user?.active ? (
              <GrStatusGoodSmall style={{ fill: "limegreen" }} />
            ) : (
              <GrStatusGoodSmall style={{ fill: "red" }} />
            )}

            <h3>{user?.active === true ? "Active" : "Inactive"}</h3>
          </div>
        </div>
      </div>
      <div className="password-card">
        <h3>Change password</h3>
        <button>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
