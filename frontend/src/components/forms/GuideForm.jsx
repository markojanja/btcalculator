import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import RichTextEditor from "../RichTextEditor";
import useCloudinary from "../../hooks/useCloudinary";
import { FormField, FormSection } from "../CalculatorUI";
import { FormActions, FormPage, PageLoading, ToggleRow } from "../PageUI";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/** Create a guide (/guides/new) or edit one (/guides/:id/edit). */
const GuideForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { uploadImage } = useCloudinary();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const getGuide = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/guides/${id}/edit`, {
          withCredentials: true,
        });
        setTitle(data.title);
        setDescription(data.description);
        setPublished(data.published);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoading(false);
      }
    };
    getGuide();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { title: title.trim(), description, published };
    try {
      setSubmitting(true);
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/guides/${id}/edit`, body, {
          withCredentials: true,
        });
        navigate(`/guides/${id}`);
      } else {
        await axios.post(`${BACKEND_URL}/guides/new`, body, {
          withCredentials: true,
        });
        navigate("/guides");
      }
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoading />;

  const backTo = isEdit ? `/guides/${id}` : "/guides";

  return (
    <FormPage
      backTo={backTo}
      backLabel={isEdit ? "Back to guide" : "Back to guides"}
      icon={BookOpen}
      title={isEdit ? "Edit guide" : "New guide"}
      description="Write down a procedure so the whole team can follow it."
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
                placeholder="e.g. How to reset a client's MT5 password"
              />
            )}
          </FormField>
          <FormField label="Content">
            <div className="text-left">
              <RichTextEditor
                value={description}
                onChange={setDescription}
                uploadImage={uploadImage}
              />
            </div>
          </FormField>
          <ToggleRow
            id="guide-published"
            title="Published"
            description="Drafts are only a work in progress; publish when it's ready."
            checked={published}
            onChange={setPublished}
          />
        </FormSection>

        <FormActions
          cancelTo={backTo}
          submitLabel={isEdit ? "Save changes" : "Create guide"}
          submitting={submitting}
          disabled={!title.trim()}
        />
      </form>
    </FormPage>
  );
};

export default GuideForm;
