import "./FeaturesCard.css";
import { Link } from "react-router-dom";

const FeaturesCard = ({ feature }) => {
  return (
    <div className="features-card">
      <Link to={`/features/${feature.id}`}>
        <h3>{feature.title}</h3>
        <span>{feature.createdAt}</span>
      </Link>
    </div>
  );
};

export default FeaturesCard;
