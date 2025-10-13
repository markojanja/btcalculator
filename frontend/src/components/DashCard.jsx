import "./DashCard.css";
import { Link } from "react-router-dom";

const DashCard = ({ title, value, linkText, linkHref, Icon, bg, clr }) => {
  return (
    <div className="dash-card">
      <div className="d-info">
        <p className={clr}>{title}</p>
        <h3>{value}</h3>
        <Link to={linkHref}>{linkText}</Link>
      </div>
      <div className="d-icon ">
        <div className={bg}>
          <Icon size={32} className={clr} />
        </div>
      </div>
    </div>
  );
};

export default DashCard;
