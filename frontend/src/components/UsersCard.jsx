import { Link } from "react-router-dom";
import { Briefcase, CalendarDays, Circle, CircleUserRound, Mail } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatDateTime, humanize } from "../lib/format";

const Row = ({ icon: Icon, children }) => (
  <div className="flex gap-1.5 items-center">
    <Icon className="h-4 w-4" />
    <p>{children}</p>
  </div>
);

export const ActiveStatus = ({ active }) => (
  <div className="flex gap-1.5 items-center">
    <Circle
      className={`h-3 w-3 ${active ? "fill-lime-400 text-lime-400" : "fill-red-400 text-red-400"}`}
    />
    <p>{active ? "Active" : "Inactive"}</p>
  </div>
);

const UsersCard = ({ user }) => {
  return (
    <Link to={`/users/edit/${user.id}`} className="w-full lg:w-1/3 mx-auto">
      <Card className="w-full text-left items-start justify-start mx-auto">
        <CardContent>
          <CardTitle className="mb-2">
            <h3>
              {user.firstname} {user.lastname}
            </h3>
          </CardTitle>
          <Row icon={Mail}>{user.email}</Row>
          <Row icon={CircleUserRound}>{user.username}</Row>
          <Row icon={Briefcase}>{humanize(user.role)}</Row>
          <ActiveStatus active={user.active} />
          <Row icon={CalendarDays}>{formatDateTime(user.createdAt)}</Row>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UsersCard;
