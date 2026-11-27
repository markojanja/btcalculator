import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import DatePicker from "../DatePicker";
import RichTextEditor from "../RichTextEditor";
import useCloudinary from "../../hooks/useCloudinary";
import { FormField, FormSection } from "../CalculatorUI";
import { FormActions, FormPage, PageLoading, ToggleRow } from "../PageUI";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/** Create a feature (/features/new) or edit one (/features/:id/edit). */
const FeatureForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { uploadImage } = useCloudinary();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [released, setReleased] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const getFeature = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/features/${id}/edit`, {
          withCredentials: true,
        });
        setTitle(data.title);
        setDescription(data.description);
        setReleased(data.released);
        setPublished(data.published);
        setReleaseDate(data.releaseDate ? new Date(data.releaseDate) : "");
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getFeature();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: title.trim(),
      description,
      // Local calendar date, so it isn't shifted a day by the timezone
      releaseDate: releaseDate ? format(releaseDate, "yyyy-MM-dd") : null,
      released,
      published,
    };
    try {
      setSubmitting(true);
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/features/${id}/edit`, body, {
          withCredentials: true,
        });
        navigate(`/features/${id}`);
      } else {
        await axios.post(`${BACKEND_URL}/features/new`, body, {
          withCredentials: true,
        });
        navigate("/features");
      }
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoading />;

  const backTo = isEdit ? `/features/${id}` : "/features";

  return (
    <FormPage
      backTo={backTo}
      backLabel={isEdit ? "Back to feature" : "Back to features"}
      icon={Megaphone}
      title={isEdit ? "Edit feature" : "New feature"}
      description="Announce a new or upcoming platform feature."
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <FormSection columns={1}>
          <FormField label="Title">
            {(fieldId) => (
              <Input
                id={fieldId}
                className="h-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. One-click trading on MT5"
              />
            )}
          </FormField>
          <FormField label="Description">
            <div className="text-left">
              <RichTextEditor
                value={description}
                onChange={setDescription}
                uploadImage={uploadImage}
              />
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Release">
          <FormField label="Release date">
            <DatePicker
              value={releaseDate}
              onChange={setReleaseDate}
              placeholder="Pick a date"
              className="h-10 w-full"
            />
          </FormField>
          <div className="hidden sm:block" />
          <ToggleRow
            id="feature-released"
            title="Released"
            description="The feature is live for clients."
            checked={released}
            onChange={setReleased}
          />
          <ToggleRow
            id="feature-published"
            title="Published"
            description="Visible to support agents."
            checked={published}
            onChange={setPublished}
          />
        </FormSection>

        <FormActions
          cancelTo={backTo}
          submitLabel={isEdit ? "Save changes" : "Create feature"}
          submitting={submitting}
          disabled={!title.trim()}
        />
      </form>
    </FormPage>
  );
};

export default FeatureForm;
