import "./Dashboard.css";
import { FaBusinessTime } from "react-icons/fa";
import { RiProgress2Line } from "react-icons/ri";
import { SiJirasoftware } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
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
            linkHref={"/"}
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
            linkHref={"/"}
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
            linkHref={"/"}
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
            linkHref={"/"}
            Icon={IoCheckmarkDoneCircle}
            bg="success-bg"
            clr={"success-txt"}
          />
        </div>
        <div className="dash-row">
          <div className="dash-chart">
            <h3>Pending Tasks</h3>
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
            <h3>Tasks by Priority</h3>
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
                  <tr>
                    <td>Signal performance fee not working</td>
                    <td>To-do</td>
                    <td>High</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Fix chart</td>
                    <td>In Progress</td>
                    <td>Medium</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Create new groups</td>
                    <td>In Progrss</td>
                    <td>Medium</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>PAMM profit share issue</td>
                    <td>IT ticket</td>
                    <td>Medium</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Fix email template</td>
                    <td>To-do</td>
                    <td>Medium</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Import new groups</td>
                    <td>In progress</td>
                    <td>High</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Add new adapter</td>
                    <td>To-do</td>
                    <td>Low</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Transaction not auto approved</td>
                    <td>CS Ticket</td>
                    <td>Medium</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Check signal close delay</td>
                    <td>IT Ticket</td>
                    <td>High</td>
                    <td>Marko Janjic</td>
                  </tr>
                  <tr>
                    <td>Add new symbol MT5</td>
                    <td>To-do</td>
                    <td>Low</td>
                    <td>Marko Janjic</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a href="/">view all tasks</a>
          </div>
          <div className="users">
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
                  <tr>
                    <td>Marko Janjic</td>
                    <td>marko.m.janjic@gmail.com</td>
                    <td>Admin</td>
                  </tr>
                  <tr>
                    <td>Marko Janjic</td>
                    <td>marko.m.janjic@gmail.com</td>
                    <td>Admin</td>
                  </tr>
                  <tr>
                    <td>Marko Janjic</td>
                    <td>marko.m.janjic@gmail.com</td>
                    <td>Admin</td>
                  </tr>
                  <tr>
                    <td>Marko Janjic</td>
                    <td>marko.m.janjic@gmail.com</td>
                    <td>Admin</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a href="/">view all users</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
