import "./Dashboard.css";
import { FaBusinessTime } from "react-icons/fa";
import { RiProgress2Line } from "react-icons/ri";
import { SiJirasoftware } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import DashCard from "../components/DashCard";

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

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, BarElement);

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [dataCard, setDataCard] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartdata, setPieChartData] = useState([]);
  const [latestTasks, setLatestTask] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

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
        setLatestTask(response.data.latestTasks);
        setRecentUsers(response.data.recentUsers);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
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
        position: "left",
      },
    },
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
      </div>
      <div className="dash-content">
        <div className="dash-row">
          <DashCard
            title={"Todo"}
            value={
              dataCard.find((item) => item.status === "TODO")?._count?.status ||
              0
            }
            linkText={"view more"}
            linkHref={"tasks/TODO"}
            Icon={FaBusinessTime}
            bg="alert-bg"
            clr={"alert-txt"}
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
            bg="warning-bg"
            clr={"warning-txt"}
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
            bg="info-bg"
            clr={"info-txt"}
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
            bg="success-bg"
            clr={"success-txt"}
          />
        </div>
        <div className="dash-row">
          <div className="dash-chart">
            <Link to={"tasks/pending"}>
              <h3>Pending Tasks</h3>
            </Link>
            <div
              style={{
                flex: "1",
                padding: "0.5rem",
                height: "300px",
              }}
            >
              <Pie data={data} options={options} />
            </div>
          </div>
          <div className="dash-chart" style={{ gridColumn: "3/5" }}>
            <Link to={"tasks/priority"}>
              <h3>Tasks by Priority</h3>
            </Link>
            <div
              style={{
                flex: "1",
                padding: "0.5rem",
                height: "300px",
              }}
            >
              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>
        <div className="dash-row">
          <div className="pending-tasks">
            <h4>Recent tasks</h4>
            <div style={{ flex: "1" }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigne</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.status}</td>
                      <td>{task.priority}</td>
                      <td>
                        {task.user.firstname} {task.user.lastname}
                      </td>
                      <td>
                        <Link to={`/dashboard/task/${task.id}`}>view task</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="tasks/ALL">view all tasks</Link>
          </div>
          <div className="users" style={{ fontSize: "12px" }}>
            <h4>Recent Users</h4>
            <div style={{ flex: "1" }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.firstname}</td>
                      <td>{user.email}</td>
                      <td className="capitalize">{user.role.toLowerCase()}</td>
                      <td>
                        <Link to={`/users/edit/${user.id}`}>
                          <FaRegEdit />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/users">view all users</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
