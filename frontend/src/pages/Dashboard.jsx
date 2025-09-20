import "./Dashboard.css";
import { FaBusinessTime } from "react-icons/fa";
import { RiProgress2Line } from "react-icons/ri";
import { SiJirasoftware } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import DashCard from "../components/DashCard";

const Dashboard = () => {
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
            title={"In progress"}
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
          <div className="pending-tasks">
            <h4>Recent tasks</h4>
            <div style={{ flex: "1" }}>
              <table className="dash-table">
                <thead>
                  <td>Title</td>
                  <td>Status</td>
                  <td>Priority</td>
                  <td>Created by</td>
                </thead>
                <tbody>
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
                  </tr>{" "}
                  <tr>
                    <td>marko</td>
                    <td>janjic</td>
                    <td>admin</td>
                    <td>yes</td>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
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
