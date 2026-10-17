import { useGuides } from "../api/guides";
import ListPage from "../components/ListPage";
import GuidesCard from "../components/GuidesCard";

const UserGuides = () => {
  const { data: guides, isLoading } = useGuides();

  return (
    <ListPage
      title="User Guides"
      items={guides}
      isLoading={isLoading}
      searchKeys={["title", "description", "user.username"]}
      newLink={{ to: "/guides/new", label: "New guide" }}
      emptyText="No new guides yet"
    >
      {(page) =>
        page.map((guide) => <GuidesCard key={guide.id} guide={guide} />)
      }
    </ListPage>
  );
};

export default UserGuides;
