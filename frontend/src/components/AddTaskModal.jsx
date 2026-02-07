import axios from "axios";
import { useEffect, useState } from "react";
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

const AddTaskModal = () => {
  const { toggleAddTaskModal, addTask } = useKanban();
  const { uploadImage } = useCloudinary();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(
    "<strong>Affected platform:</strong><br><br><strong>Problem Description:</strong><br><br><strong>Actions done:</strong><br><br><strong>How to reproduce:</strong><br><br><strong>Logs:</strong><br><br>",
  );
  const [status, setStatus] = useState(STATUS[0]);
  const [priority, setPriority] = useState(PRIORITY[0]);
  const [client, setClient] = useState("");

  const [activeClients, setActiveClients] = useState([]);

  useEffect(() => {
    const getActiveClients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/clients/active`, {
          withCredentials: true,
        });
        console.log(res.data);
        setActiveClients(res.data);
      } catch (error) {
        console.error("Failed to fetch active clients:", error.response?.data);
      }
    };

    getActiveClients();
  }, [BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/tasks/add_task`,
        {
          title,
          client,
          description: content,
          status,
          priority,
        },
        { withCredentials: true },
      );

      addTask(response.data.task);
      toggleAddTaskModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background pt-12 pb-12 overflow-y-auto">
      <Card className="w-175 relative">
        <button
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          onClick={toggleAddTaskModal}
        >
          <IoMdClose size={22} />
        </button>

        <CardTitle className="px-6 pt-6">
          <h3 className="text-left font-bold">Add task</h3>
        </CardTitle>

        <CardContent className="max-h-[70vh] overflow-y-auto flex flex-col gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-start"
          >
            <FieldGroup>
              <Field>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="w-full">
              <Field>
                <Label>Client</Label>
                <Select value={client.id} onValueChange={setClient}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeClients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskModal;
