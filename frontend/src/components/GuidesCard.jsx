import "./GuidesCard.css";
import { Link } from "react-router-dom";

const GuidesCard = ({ guide }) => {
  return (
    <div className="guides-card">
      <Link to={`/guides/${guide.id}`}>
        <h3>{guide.title}</h3>
        <p>Author: {guide.user?.username}</p>
        <p>Published:{guide.published ? "✅" : "❌"}</p>
        <p>Created: {new Date(guide.createdAt).toLocaleDateString()}</p>
      </Link>
    </div>
  );
};

export default GuidesCard;
