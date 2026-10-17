import { useFeatures } from "../api/features";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import ListPage from "../components/ListPage";
import FeaturesCard from "../components/FeaturesCard";

const NewFeatures = () => {
  const { user } = useAuth();
  const { data: features, isLoading } = useFeatures();

  return (
    <ListPage
      title="Feature Announcements"
      items={features}
      isLoading={isLoading}
      searchKeys={["title", "description", "user.username"]}
      newLink={isStaff(user) && { to: "/features/new", label: "New feature" }}
      emptyText="No new features yet"
    >
      {(page) =>
        page.map((feature) => (
          <FeaturesCard key={feature.id} feature={feature} />
        ))
      }
    </ListPage>
  );
};

export default NewFeatures;
