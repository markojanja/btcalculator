import { FaUserCircle } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import { CiCalendarDate } from "react-icons/ci";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const UsersCard = ({ user }) => {
  return (
    <Link to={`/users/edit/${user.id}`}>
      <Card
        className={
          "w-full lg:w-1/3 text-left items-start justify-start mx-auto"
        }
      >
        <CardContent>
          <CardTitle className={"mb-2"}>
            <h3>
              {user.firstname} {user.lastname}
            </h3>
          </CardTitle>

          <div className="flex gap-1.5 items-center">
            <MdOutlineEmail />
            <p>{user.email}</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <FaUserCircle />
            <p>{user.username}</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <IoBriefcase />
            <p>{user.role}</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <GrStatusGoodSmall
              className={user.active ? "text-lime-400" : "text-red-400"}
            />
            <p>{user?.active ? "active" : "inactive"}</p>
          </div>
          <div className="flex gap-1.5 items-center">
            <CiCalendarDate />
            <p>{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UsersCard;
