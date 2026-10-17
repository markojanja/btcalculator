import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featuresApi, featuresKeys, useFeature } from "../api/features";
import FormCard from "../components/form/FormCard";
import ContentForm from "../components/form/ContentForm";
import Loading from "../components/Loading";

// /features/new and /features/:id/edit
const FeatureFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: feature, isLoading } = useFeature(id);

  const save = useMutation({
    mutationFn: (values) =>
      id ? featuresApi.update(id, values) : featuresApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featuresKeys.all });
      navigate(id ? `/features/${id}` : "/features");
    },
  });

  if (id && isLoading) return <Loading />;

  return (
    <FormCard
      title={id ? "Edit feature" : "New feature"}
      backTo="/features"
      backLabel="Back to features"
    >
      <ContentForm
        withRelease
        initialValues={
          feature && {
            ...feature,
            releaseDate: feature.releaseDate && new Date(feature.releaseDate),
          }
        }
        onSubmit={save.mutate}
        pending={save.isPending}
      />
    </FormCard>
  );
};

export default FeatureFormPage;
