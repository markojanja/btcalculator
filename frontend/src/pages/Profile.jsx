import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Briefcase, CircleUserRound, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { useUserStats } from "../api/users";
import { humanize } from "../lib/format";
import { ActiveStatus } from "../components/UsersCard";
import PasswordModal from "../components/PasswordModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const STAT_TILES = [
  { key: "totalTasks", label: "Total" },
  { key: "completed", label: "Completed", color: "#22C55E" },
  { key: "csTicket", label: "CS Tickets", color: "#F97316" },
  { key: "itTicket", label: "IT Tickets", color: "#EF4444" },
];
const CHART_TILES = STAT_TILES.filter((tile) => tile.color);

// Task counts for support agents.
const TaskOverview = ({ userId }) => {
  const { data: stats = {} } = useUserStats(userId);

  const chartData = {
    labels: CHART_TILES.map((tile) => tile.label),
    datasets: [
      {
        data: CHART_TILES.map((tile) => stats[tile.key] ?? 0),
        backgroundColor: CHART_TILES.map((tile) => tile.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="w-full lg:w-[60%] mx-auto">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-6 text-left">Task Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm">
              <Doughnut data={chartData} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {STAT_TILES.map((tile) => (
              <div key={tile.key} className="rounded-xl border p-4 bg-background">
                <p className="text-sm text-muted-foreground">{tile.label}</p>
                <p className="text-xl font-bold">{stats[tile.key] ?? 0}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-2">
      <Card className="w-full lg:w-[60%] mx-auto flex">
        <CardContent className="flex flex-row items-center justify-center p-6 gap-4">
          <div className="flex items-center justify-center w-[50%] lg:w-[30%] p-2">
            <CircleUserRound className="w-30 h-30 p-3 lg:w-60 lg:h-60 lg:p-6 shrink-0" />
          </div>
          <div className="flex flex-col gap-3 w-full text-left">
            <h3 className="font-bold text-2xl">
              {user.firstname} {user.lastname}
            </h3>
            <div className="flex flex-row items-center gap-2">
              <Mail className="h-4 w-4" />
              <h3>{user.email}</h3>
            </div>
            <div className="flex flex-row items-center gap-2">
              <CircleUserRound className="h-4 w-4" />
              <h3>{user.username}</h3>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <h3>{humanize(user.role)}</h3>
            </div>
            <ActiveStatus active={user.active} />
          </div>
        </CardContent>
        <CardContent className="flex flex-row items-center justify-end gap-2">
          <Button onClick={() => setShowPasswordModal(true)}>
            Change Password
          </Button>
        </CardContent>
      </Card>
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {user.role === "SUPPORT" && <TaskOverview userId={user.id} />}
    </div>
  );
};

export default Profile;
