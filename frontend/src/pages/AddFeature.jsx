import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "../components/DatePicker";
import RichTextEditor from "../components/RichTextEditor";
import useCloudinary from "../hooks/useCloudinary";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const AddFeature = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [released, setReleased] = useState(false);
  const [published, setPublished] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");

  const navigate = useNavigate();
  const { uploadImage } = useCloudinary();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFeature = {
        title,
        description,
        releaseDate,
        released,
        published,
      };
      await axios.post(`${BACKEND_URL}/features/new`, newFeature, {
        withCredentials: true,
      });
      navigate("/features");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Card className={"w-187.5 mx-auto"}>
        <CardTitle className={"px-6"}>
          <h3 className="text-left font-bold">New feature</h3>
        </CardTitle>
        <CardContent>
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 items-start"
          >
            <FieldGroup>
              <Field className={"text-left"}>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field className={"text-left"}>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  uploadImage={uploadImage}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field className={"text-left"}>
                <Label>Release Date</Label>
                <DatePicker
                  value={releaseDate}
                  onChange={setReleaseDate}
                  placeholder={"select release date"}
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="max-w-sm">
              <Field orientation="horizontal">
                <Label>Released</Label>
                <Checkbox
                  id="checkbox"
                  type="checkbox"
                  checked={released}
                  onCheckedChange={() => {
                    setReleased(!released);
                  }}
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="max-w-sm">
              <Field orientation="horizontal">
                <Label>Published</Label>
                <Checkbox
                  id="checkbox-pub"
                  type="checkbox-pub"
                  checked={published}
                  onCheckedChange={() => {
                    setPublished(!published);
                  }}
                />
              </Field>
            </FieldGroup>
            <Button className="w-full">Save</Button>
          </form>
        </CardContent>

        <Link className="flex justify-end items-center mr-4" to={"/features"}>
          <IoMdArrowRoundBack /> Back to features
        </Link>
      </Card>
    </div>
  );
};

export default AddFeature;
