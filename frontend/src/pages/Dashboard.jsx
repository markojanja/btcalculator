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
            title={"TODO"}
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
      </div>
    </div>
  );
};

export default Dashboard;
