import "./UsersCard.css";
import { FaUserCircle } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";

const UsersCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="card-header">
        <h4>
          {user.firstname} {user.lastname}
        </h4>
        <FaRegEdit />
      </div>
      <div className="card-info">
        <div className="card-info-section">
          <MdOutlineEmail />
          <p>{user.email}</p>
        </div>
        <div className="card-info-section">
          <FaUserCircle />
          <p>{user.username}</p>
        </div>
        <div className="card-info-section">
          <IoBriefcase />
          <p>{user.role}</p>
        </div>
        <div className="card-info-section">
          <GrStatusGoodSmall style={{ fill: user?.active ? "limegreen" : "red" }} />
          <p>{user?.active ? "active" : "inactive"}</p>
        </div>
        <div className="card-info-section">
          <CiCalendarDate />
          <p>{new Date(user.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersCard;
