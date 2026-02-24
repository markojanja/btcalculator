import { FaBusinessTime } from "react-icons/fa";
import { RiProgress2Line } from "react-icons/ri";
import { SiJirasoftware } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import DashCard from "../components/DashCard";
import useNotification from "../hooks/useNotification";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
} from "chart.js/auto";
import { Pie, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, BarElement);

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
        console.log(response);
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

  const labels1 = pieChartdata.map((obj) => obj.firstname);
  const data = {
    labels: labels1,
    datasets: [
      {
        label: "Pending Tasks",
        data: pieChartdata.map((obj) => obj.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const labels2 = pieChartdataCli.map((obj) => obj.name);
  const clientsTasksData = {
    labels: labels2,
    datasets: [
      {
        label: "Pending Tasks by Client",
        data: pieChartdataCli?.map((obj) => obj.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityOrder = ["HIGH", "MEDIUM", "LOW"];
  const colors = [
    { bg: "rgba(255, 99, 132, 0.5)", border: "rgba(255, 99, 132, 1)" },
    { bg: "rgba(54, 162, 235, 0.5)", border: "rgba(54, 162, 235, 1)" },
    { bg: "rgba(75, 192, 192, 0.5)", border: "rgba(75, 192, 192, 1)" },
  ];

  const datasets = priorityOrder
    .map((priority, i) => {
      const match = barChartData.find((d) => d.priority === priority);
      const count = match ? match._count.priority : 0;

      if (count === 0) return null;
      return {
        label: priority,
        data: [count],
        backgroundColor: colors[i].bg,
        borderColor: colors[i].border,
        borderWidth: 1,
      };
    })
    .filter(Boolean);

  const barData = {
    labels: [""],
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.innerWidth < 767 ? "bottom" : "left",
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4">
          <DashCard
            title={"Todo"}
            value={
              dataCard.find((item) => item.status === "TODO")?._count?.status ||
              0
            }
            linkText={"view more"}
            linkHref={"tasks/TODO"}
            Icon={FaBusinessTime}
            bg="bg-red-500/20"
            clr={"text-red-500/80"}
          />
          <DashCard
            title={"In Progress"}
            value={
              dataCard.find((item) => item.status === "IN_PROGRESS")?._count
                ?.status || 0
            }
            linkText={"view more"}
            linkHref={"tasks/IN_PROGRESS"}
            Icon={RiProgress2Line}
            bg="bg-yellow-500/20"
            clr={"text-yellow-500/80"}
          />
          <DashCard
            title={"Jira Ticket"}
            value={
              dataCard.find((item) => item.status === "JIRA_TICKET")?._count
                ?.status || 0
            }
            linkText={"view more"}
            linkHref={"tasks/JIRA_TICKET"}
            Icon={SiJirasoftware}
            bg="bg-teal-500/20"
            clr={"text-teal-500/80"}
          />
          <DashCard
            title={"Completed"}
            value={
              dataCard.find((item) => item.status === "COMPLETED")?._count
                ?.status || 0
            }
            linkText={"view more"}
            linkHref={"tasks/COMPLETED"}
            Icon={IoCheckmarkDoneCircle}
            bg="bg-green-500/20"
            clr={"text-green-500/80"}
          />
        </div>
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4">
          <Card className={"col-span-2 min-w-0"}>
            <CardTitle className={"text-left px-6"}>
              <Link to={"tasks/pending"}>
                <h3>Pending Tasks</h3>
              </Link>
            </CardTitle>
            <CardContent>
              <div className="relative flex p-2 h-75 w-full">
                <Pie data={data} options={options} />
              </div>
            </CardContent>
          </Card>
          <Card className={"col-span-2 min-w-0"}>
            <CardTitle className={"text-left px-6"}>
              <Link to={"tasks/priority"}>
                <h3>Tasks by Priority</h3>
              </Link>
            </CardTitle>
            <CardContent>
              <div className="relative flex p-2 h-75 w-full">
                <Bar data={barData} options={options} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4 mx-auto">
          <Card className={"lg:col-span-3 w-full overflow-auto"}>
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
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestTasks.map((task) => (
                    <TableRow key={task.id}>
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
                      <TableCell>
                        <Link to={`/dashboard/task/${task.id}`}>view task</Link>
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

          <Card className={"col-span-1 overflow-auto"}>
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
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">
                        {user.role.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        <Link to={`/users/edit/${user.id}`}>
                          <FaRegEdit />
                        </Link>
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
        <div className="grid lg:grid-cols-4 w-full gap-2 py-4">
          <Card className={"col-span-2 min-w-0"}>
            <CardTitle className={"text-left px-6"}>
              <h3>Tasks by Clients</h3>
            </CardTitle>
            <CardContent>
              <div className="flex p-2 h-75 w-full">
                <Pie data={clientsTasksData} options={options} />
              </div>
            </CardContent>
          </Card>

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
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClients.map((client) => (
                    <TableRow key={client.id}>
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
                      <TableCell>
                        <Link to={`/clients/${client.id}/edit`}>
                          <FaRegEdit />
                        </Link>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
