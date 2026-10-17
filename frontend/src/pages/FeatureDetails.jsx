import { Link, useParams } from "react-router-dom";
import { useFeature } from "../api/features";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import { formatDate } from "../lib/format";
import DetailLayout from "../components/DetailLayout";
import Loading from "../components/Loading";

const FeatureDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: feature, isLoading } = useFeature(id);

  if (isLoading || !feature) return <Loading />;

  return (
    <DetailLayout
      title={feature.title}
      html={feature.description}
      actions={
        isStaff(user) && (
          <Link
            to={`/features/${feature.id}/edit`}
            className="border border-primary rounded-sm text-primary px-4 py-1.5 hover:bg-primary/20 transition-all duration-150 text-sm"
          >
            Edit feature
          </Link>
        )
      }
      details={
        <>
          <p>author: {feature.user?.username}</p>
          <p>published: {feature.published ? "✅" : "❌"}</p>
          <p>released: {feature.released ? "✅" : "❌"}</p>
          <p>release date: {formatDate(feature.releaseDate)}</p>
        </>
      }
      backTo="/features"
      backLabel="Back to features"
    />
  );
};

export default FeatureDetails;
