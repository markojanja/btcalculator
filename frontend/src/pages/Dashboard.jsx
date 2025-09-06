import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
      </div>
      <div className="dash-content">
        <div className="dash-row">
          <h3>Tasks</h3>
          <div className="dash-card"></div>
        </div>
        <div className="dash-row">
          <div className="dash-card"></div>
        </div>{" "}
        <div className="dash-row">
          <div className="dash-card"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
