import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guidesApi, guidesKeys, useGuide } from "../api/guides";
import FormCard from "../components/form/FormCard";
import ContentForm from "../components/form/ContentForm";
import Loading from "../components/Loading";

// /guides/new and /guides/:id/edit
const GuideFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: guide, isLoading } = useGuide(id);

  const save = useMutation({
    mutationFn: (values) =>
      id ? guidesApi.update(id, values) : guidesApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidesKeys.all });
      navigate(id ? `/guides/${id}` : "/guides");
    },
  });

  if (id && isLoading) return <Loading />;

  return (
    <FormCard
      title={id ? "Edit guide" : "New guide"}
      backTo="/guides"
      backLabel="Back to guides"
    >
      <ContentForm
        initialValues={guide}
        onSubmit={save.mutate}
        pending={save.isPending}
      />
    </FormCard>
  );
};

export default GuideFormPage;
