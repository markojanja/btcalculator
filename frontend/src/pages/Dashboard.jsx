import { CircleCheckBig, ListTodo, Loader, Ticket } from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
            <CardHeader>
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
            <CardHeader>
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
            <CardHeader>
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
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4 mx-auto">
          <Card className={"lg:col-span-4 w-full overflow-auto"}>
            <CardTitle className={"text-left px-6"}>
              <h4>Recent tasks</h4>
            </CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Assigne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestTasks.map((task) => (
                    <TableRow
                      onClick={() => navigate(`/dashboard/task/${task.id}`)}
                      key={task.id}
                      className={"cursor-pointer"}
                    >
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>
                        {new Date(task.createdAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {task.user.firstname} {task.user.lastname}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className={"mb-0 mt-auto"}>
              <Link to="tasks/ALL">view all tasks</Link>
            </CardFooter>
          </Card>
        </div>
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4">
          <Card className={"col-span-2 overflow-auto"}>
            <CardTitle className={"text-left px-6"}>
              <h4>Recent Clients</h4>
            </CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Platform</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClients.map((client) => (
                    <TableRow
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                      key={client.id}
                      className={"cursor-pointer"}
                    >
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.status}</TableCell>
                      <TableCell>{client.server[0]}</TableCell>
                      <TableCell>
                        {client.platform.map((p, idx) => (
                          <Badge
                            variant="secondary"
                            size="s"
                            className={"mr-1"}
                            key={idx}
                          >
                            {p}
                          </Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className={"mb-0 mt-auto"}>
              <Link to="/clients">view all clients</Link>
            </CardFooter>
          </Card>
          <Card className={"col-span-2 overflow-auto"}>
            <CardTitle className={"text-left px-6"}>
              <h4>Recent Users</h4>
            </CardTitle>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                      key={user.id}
                      className={"cursor-pointer"}
                    >
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.role.toLowerCase()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className={"mb-0 mt-auto"}>
              <Link to="/users">view all users</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
