import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

const AdminTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({});
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    status: "",
    priority: "",
    userId: "",
  });

  const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET", "COMPLETED"];
  const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/task/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log(response);
        setUsers(response.data.users);
        setTask(response.data.task);
      } catch (error) {
        console.log(error);
      }
    };

    getTask();
  }, []);

  useEffect(() => {
    if (task?.id) {
      setFormData({
        id: task.id,
        status: task.status || "",
        priority: task.priority || "",
        userId: task.userId || "",
      });
    }
  }, [task]);

  const clean = DOMPurify.sanitize(task.description);

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`${BACKEND_URL}/tasks/edit_task`, formData, {
        withCredentials: true,
      });
      if (res) {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-187.5 mx-auto gap-4">
      <CardTitle className="flex justify-between items-center w-full bg-card shadow-sm p-4 rounded-md">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <Badge>{task.client?.name}</Badge>
      </CardTitle>
      <Card>
        <div
          className="flex flex-col overflow-y-scroll max-h-screen text-left p-4 gap-4 rte"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </Card>
      <Card>
        <CardContent className={"flex flex-col gap-4"}>
          <FieldGroup className={"flex flex-row items-center"}>
            <Field>
              <Label>User</Label>
              <Select
                value={formData.userId}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, userId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
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

          <Button className="w-full" onClick={handleSubmit}>
            Edit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTask;
