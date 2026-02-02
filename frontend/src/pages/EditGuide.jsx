import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

import RichTextEditor from "../components/RichTextEditor";
import useCloudinary from "../hooks/useCloudinary";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

const EditGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadImage } = useCloudinary();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getGuide = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/guides/${id}/edit`, {
          withCredentials: true,
        });
        const guide = response.data;
        setTitle(guide.title);
        setDescription(guide.description);
        setPublished(guide.published);
      } catch (error) {
        console.log(error);
      }
    };

    getGuide();
  }, [id, BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, published };

    try {
      await axios.put(`${BACKEND_URL}/guides/${id}/edit`, data, {
        withCredentials: true,
      });
      navigate("/guides");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="w-187.5 mx-auto">
        <CardTitle className="px-6">
          <h3 className="text-left font-bold">Edit Guide</h3>
        </CardTitle>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 items-start"
          >
            <FieldGroup>
              <Field className="text-left">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field className="text-left">
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  uploadImage={uploadImage}
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="max-w-sm">
              <Field orientation="horizontal">
                <Label>Published</Label>
                <Checkbox
                  checked={published}
                  onCheckedChange={() => setPublished(!published)}
                />
              </Field>
            </FieldGroup>

            <Button className="w-full">Save</Button>
          </form>
        </CardContent>

        <Link className="flex justify-end items-center mr-4" to="/guides">
          <IoMdArrowRoundBack /> Back to guides
        </Link>
      </Card>
    </div>
  );
};

export default EditGuide;
