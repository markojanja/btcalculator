import axios from "axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

import useKanban from "../hooks/useKanban";
import RichTextEditor from "./RichTextEditor";
import useCloudinary from "../hooks/useCloudinary";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { toggleEditTaskModal, updateTask, activeTask, getTasks } = useKanban();

  const { uploadImage } = useCloudinary();

  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

  const [title, setTitle] = useState(activeTask?.title ?? "");
  const [content, setContent] = useState(activeTask?.description ?? "");
  const [status, setStatus] = useState(activeTask?.status ?? STATUS[0]);
  const [priority, setPriority] = useState(activeTask?.priority ?? PRIORITY[0]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updatedTask = {
        ...activeTask,
        title,
        description: content,
        status,
        priority,
      };

      // optimistic update
      updateTask(updatedTask);

      await axios.put(`${BACKEND_URL}/tasks/edit_task`, updatedTask, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await getTasks();
      toggleEditTaskModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background pt-12 pb-12 overflow-y-auto">
      <div className="relative w-full max-w-175 mx-4">
        <Card className="relative w-full">
          <button
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
            onClick={toggleEditTaskModal}
          >
            <IoMdClose size={22} />
          </button>

          <CardTitle className="px-6 pt-6">
            <h3 className="text-left font-bold">Edit task</h3>
          </CardTitle>

          <CardContent className="max-h-[70vh] overflow-y-auto flex flex-col gap-4">
            <form onSubmit={handleSave} className="flex flex-col gap-4 w-full">
              <FieldGroup>
                <Field>
                  <Label>Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    uploadImage={uploadImage}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="w-full grid grid-cols-2 gap-4">
                <Field>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <Button className="w-full mt-2" type="submit">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTask;
