import { format } from "date-fns";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useFormState from "../../hooks/useFormState";
import RichTextEditor from "../RichTextEditor";
import DatePicker from "../DatePicker";
import { CheckboxField, TextField } from "./fields";

const EMPTY_GUIDE = { title: "", description: "", published: false };

const EMPTY_FEATURE = {
  ...EMPTY_GUIDE,
  releaseDate: null,
  released: false,
};

// Guides and feature announcements are both a title, a rich-text body and a
// published flag; features add a release date and a released flag.
const ContentForm = ({
  initialValues,
  withRelease = false,
  onSubmit,
  pending,
}) => {
  const { values, setField } = useFormState({
    ...(withRelease ? EMPTY_FEATURE : EMPTY_GUIDE),
    ...initialValues,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, published } = values;
    const content = { title, description, published };

    onSubmit(
      withRelease
        ? {
            ...content,
            released: values.released,
            releaseDate: values.releaseDate
              ? format(values.releaseDate, "yyyy-MM-dd")
              : null,
          }
        : content,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-start">
      <FieldGroup>
        <TextField
          label="Title"
          className="text-left"
          value={values.title}
          onChange={setField("title")}
        />
        <Field className="text-left">
          <RichTextEditor
            value={values.description}
            onChange={setField("description")}
          />
        </Field>
        {withRelease && (
          <>
            <Field className="text-left">
              <Label>Release Date</Label>
              <DatePicker
                value={values.releaseDate}
                onChange={setField("releaseDate")}
                placeholder="select release date"
              />
            </Field>
            <CheckboxField
              label="Released"
              checked={values.released}
              onChange={setField("released")}
            />
          </>
        )}
        <CheckboxField
          label="Published"
          checked={values.published}
          onChange={setField("published")}
        />
      </FieldGroup>
      <Button className="w-full" type="submit" disabled={pending}>
        Save
      </Button>
    </form>
  );
};

export default ContentForm;
