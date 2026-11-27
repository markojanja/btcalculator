import {
  ArrowRight,
  CircleCheckBig,
  ListTodo,
  Loader,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashCard from "../components/DashCard";
import useNotification from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";

import { DonutChart, HorizontalBarChart } from "../components/Charts";
import { PRIORITY_COLORS } from "../utils/chartColors";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableCell } from "@/components/ui/table";
import {
  ClickableRow,
  ClientStatusLabel,
  DataTable,
  DateCell,
  EmptyRow,
  PersonCell,
  PriorityLabel,
  RoleBadge,
  TaskStatusBadge,
} from "../components/TableCells";
import { Badge } from "@/components/ui/badge";

// Status cards at the top of the dashboard; colours match the task board.
const STATUS_CARDS = [
  {
    status: "TODO",
    title: "To do",
    description: "Waiting to be picked up",
    icon: ListTodo,
    tone: "red",
  },
  {
    status: "IN_PROGRESS",
    title: "In progress",
    description: "Being worked on",
    icon: Loader,
    tone: "blue",
  },
  {
    status: "JIRA_TICKET",
    title: "Jira tickets",
    description: "CS and IT tickets",
    icon: Ticket,
    tone: "amber",
  },
  {
    status: "COMPLETED",
    title: "Completed",
    description: "Done",
    icon: CircleCheckBig,
    tone: "emerald",
  },
];

// Card with a title, description and a "view all" link in the header.
const TableCard = ({ title, description, href, linkText, children }) => (
  <Card className="w-full min-w-0 gap-4">
    <CardHeader className="flex flex-row items-start justify-between gap-4 text-left">
      <div className="space-y-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Link
        to={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {linkText}
        <ArrowRight className="size-4" />
      </Link>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [dataCard, setDataCard] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartdata, setPieChartData] = useState([]);
  const [pieChartdataCli, setPieChartDataCli] = useState([]);
  const [latestTasks, setLatestTask] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const { lastEvent } = useNotification();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/admindata/`, {
          withCredentials: true,
        });
        setDataCard(response.data.tasksByStatus);
        setBarChartData(response.data.tasksByPriority);
        setPieChartData(response.data.rawByUser);
        setPieChartDataCli(response.data.clientsTasks);
        setLatestTask(response.data.latestTasks);
        setRecentUsers(response.data.recentUsers);
        setRecentClients(response.data.recentClients);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [lastEvent]);

  // Chart data: [{ label, value, color? }]
  const tasksByUser = pieChartdata.map((row) => ({
    label: row.firstname,
    value: row.count,
  }));

  const tasksByClient = pieChartdataCli.map((row) => ({
    label: row.name,
    value: row.count,
  }));

  const tasksByPriority = ["HIGH", "MEDIUM", "LOW"].map((priority) => ({
    label: priority.charAt(0) + priority.slice(1).toLowerCase(),
    value:
      barChartData.find((row) => row.priority === priority)?._count
        ?.priority ?? 0,
    color: PRIORITY_COLORS[priority],
  }));

  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid w-full gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_CARDS.map((card) => (
            <DashCard
              key={card.status}
              title={card.title}
              description={card.description}
              value={
                dataCard.find((item) => item.status === card.status)?._count
                  ?.status || 0
              }
              href={`tasks/${card.status}`}
              Icon={card.icon}
              tone={card.tone}
            />
          ))}
        </div>
        <div className="grid w-full gap-4 py-4 lg:grid-cols-3">
          <Card className="min-w-0">
            <CardHeader className="text-left">
              <CardTitle>Pending tasks by user</CardTitle>
              <CardDescription>Open tasks per support agent</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                items={tasksByUser}
                emptyMessage="No pending tasks at the moment"
              />
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="text-left">
              <CardTitle>Pending tasks by priority</CardTitle>
              <CardDescription>Open tasks, highest priority first</CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart
                items={tasksByPriority}
                emptyMessage="No pending tasks at the moment"
              />
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="text-left">
              <CardTitle>Pending tasks by client</CardTitle>
              <CardDescription>Open tasks per client</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                items={tasksByClient}
                emptyMessage="No pending tasks at the moment"
              />
            </CardContent>
          </Card>
        </div>
        <TableCard
          title="Recent tasks"
          description="The latest tasks across all agents"
          href="tasks/ALL"
          linkText="View all tasks"
        >
          <DataTable
            columns={["Task", "Status", "Priority", "Created", "Assignee"]}
          >
            {latestTasks.length === 0 && (
              <EmptyRow colSpan={5}>No tasks yet</EmptyRow>
            )}
            {latestTasks.map((task) => (
              <ClickableRow
                key={task.id}
                onOpen={() => navigate(`/dashboard/task/${task.id}`)}
              >
                <TableCell className="max-w-72 truncate font-medium">
                  {task.title}
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityLabel priority={task.priority} />
                </TableCell>
                <TableCell>
                  <DateCell value={task.createdAt} />
                </TableCell>
                <TableCell>
                  <PersonCell
                    firstname={task.user.firstname}
                    lastname={task.user.lastname}
                  />
                </TableCell>
              </ClickableRow>
            ))}
          </DataTable>
        </TableCard>

        <div className="grid w-full gap-4 py-4 lg:grid-cols-2">
          <TableCard
            title="Recent clients"
            description="Newest clients and where they trade"
            href="/clients"
            linkText="View all clients"
          >
            <DataTable columns={["Client", "Status", "Server", "Platforms"]}>
              {recentClients.length === 0 && (
                <EmptyRow colSpan={4}>No clients yet</EmptyRow>
              )}
              {recentClients.map((client) => (
                <ClickableRow
                  key={client.id}
                  onOpen={() => navigate(`/clients/${client.id}/edit`)}
                >
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <ClientStatusLabel status={client.status} />
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {client.server[0]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.platform.map((p) => (
                        <Badge key={p} variant="outline" className="font-normal">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </ClickableRow>
              ))}
            </DataTable>
          </TableCard>

          <TableCard
            title="Recent users"
            description="Newest team members"
            href="/users"
            linkText="View all users"
          >
            <DataTable columns={["User", "Role"]}>
              {recentUsers.length === 0 && (
                <EmptyRow colSpan={2}>No users yet</EmptyRow>
              )}
              {recentUsers.map((user) => (
                <ClickableRow
                  key={user.id}
                  onOpen={() => navigate(`/users/edit/${user.id}`)}
                >
                  <TableCell>
                    <PersonCell
                      firstname={user.firstname}
                      lastname={user.lastname}
                      subtitle={user.email}
                    />
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                </ClickableRow>
              ))}
            </DataTable>
          </TableCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
