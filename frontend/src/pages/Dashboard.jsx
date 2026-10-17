import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { BriefcaseBusiness, CircleCheckBig, CircleDashed, Ticket } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "../api/admin";
import { formatDate, humanize } from "../lib/format";
import DashCard from "../components/dashboard/DashCard";
import ChartCard from "../components/dashboard/ChartCard";
import TableCard from "../components/dashboard/TableCard";
import {
  chartOptions,
  pieData,
  priorityBarData,
} from "../components/dashboard/chartConfig";
import Loading from "../components/Loading";

const STATUS_CARDS = [
  { status: "TODO", title: "Todo", Icon: BriefcaseBusiness, color: "red" },
  { status: "IN_PROGRESS", title: "In Progress", Icon: CircleDashed, color: "yellow" },
  { status: "JIRA_TICKET", title: "Jira Ticket", Icon: Ticket, color: "teal" },
  { status: "COMPLETED", title: "Completed", Icon: CircleCheckBig, color: "green" },
];

// Spelled out so Tailwind keeps these classes in the build.
const CARD_COLORS = {
  red: { bg: "bg-red-500/20", clr: "text-red-500/80" },
  yellow: { bg: "bg-yellow-500/20", clr: "text-yellow-500/80" },
  teal: { bg: "bg-teal-500/20", clr: "text-teal-500/80" },
  green: { bg: "bg-green-500/20", clr: "text-green-500/80" },
};

const ClickableRow = ({ to, children }) => {
  const navigate = useNavigate();
  return (
    <TableRow onClick={() => navigate(to)} className="cursor-pointer">
      {children}
    </TableRow>
  );
};

const Dashboard = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) return <Loading />;

  const countFor = (status) =>
    data.tasksByStatus.find((item) => item.status === status)?._count?.status ??
    0;
  const byUser = pieData(data.rawByUser, "firstname", "Pending Tasks");
  const byClient = pieData(data.clientsTasks, "name", "Pending Tasks by Client");
  const byPriority = priorityBarData(data.tasksByPriority);
  const options = chartOptions();

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4">
          {STATUS_CARDS.map(({ status, title, Icon, color }) => (
            <DashCard
              key={status}
              title={title}
              value={countFor(status)}
              linkText="view more"
              linkHref={`tasks/${status}`}
              Icon={Icon}
              {...CARD_COLORS[color]}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-6 w-full gap-2 py-4">
          <ChartCard
            title="Pending Tasks by User"
            isEmpty={data.rawByUser.length === 0}
          >
            <Pie data={byUser} options={options} />
          </ChartCard>
          <ChartCard
            title="Pending Tasks by Priority"
            isEmpty={byPriority.datasets.length === 0}
          >
            <Bar data={byPriority} options={options} />
          </ChartCard>
          <ChartCard
            title="Pending Tasks by Clients"
            isEmpty={data.clientsTasks.length === 0}
          >
            <Pie data={byClient} options={options} />
          </ChartCard>
        </div>

        <div className="grid w-full gap-2 py-4">
          <TableCard
            title="Recent tasks"
            footerLink={{ to: "tasks/ALL", label: "view all tasks" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.latestTasks.map((task) => (
                <ClickableRow key={task.id} to={`/dashboard/task/${task.id}`}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                  <TableCell>
                    {task.user.firstname} {task.user.lastname}
                  </TableCell>
                </ClickableRow>
              ))}
            </TableBody>
          </TableCard>
        </div>

        <div className="grid lg:grid-cols-2 w-full gap-2 py-4">
          <TableCard
            title="Recent Clients"
            footerLink={{ to: "/clients", label: "view all clients" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Platform</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentClients.map((client) => (
                <ClickableRow key={client.id} to={`/clients/${client.id}/edit`}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell>{client.server[0]}</TableCell>
                  <TableCell>
                    {client.platform.map((platform) => (
                      <Badge variant="secondary" className="mr-1" key={platform}>
                        {platform}
                      </Badge>
                    ))}
                  </TableCell>
                </ClickableRow>
              ))}
            </TableBody>
          </TableCard>
          <TableCard
            title="Recent Users"
            footerLink={{ to: "/users", label: "view all users" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentUsers.map((user) => (
                <ClickableRow key={user.id} to={`/users/edit/${user.id}`}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{humanize(user.role)}</TableCell>
                </ClickableRow>
              ))}
            </TableBody>
          </TableCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
