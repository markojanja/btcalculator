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

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, BarElement);

const Dashboard = () => {
  const labels1 = ["Marko", "Tijana", "Demo", "Aleksandra", "Sava"];
  const data = {
    labels: labels1,
    datasets: [
      {
        label: "Pending Tasks",
        data: [12, 15, 7, 3, 8],
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

  const labels2 = ["Tasks by priority"];

  const barData = {
    labels: labels2,
    datasets: [
      {
        label: "High",
        data: [30],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Medium",
        data: [20],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Low",
        data: [50],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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
            value={10}
            linkText={"view more"}
            linkHref={"/"}
            Icon={FaBusinessTime}
            bg="alert-bg"
            clr={"alert-txt"}
          />
          <DashCard
            title={"In Progress"}
            value={7}
            linkText={"view more"}
            linkHref={"/"}
            Icon={RiProgress2Line}
            bg="warning-bg"
            clr={"warning-txt"}
          />{" "}
          <DashCard
            title={"Jira Ticket"}
            value={5}
            linkText={"view more"}
            linkHref={"/"}
            Icon={SiJirasoftware}
            bg="info-bg"
            clr={"info-txt"}
          />{" "}
          <DashCard
            title={"Completed"}
            value={15}
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
