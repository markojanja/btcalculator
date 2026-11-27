import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { Building2, CalendarDays, MessageSquare, Save, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getComments } from "../utils/fetchData.js";
import CommentInput from "../components/CommentInput";
import CommentCard from "../components/CommentCard";
import useNotification from "../hooks/useNotification";
import { FormField, SelectInput } from "../components/CalculatorUI";
import { PriorityLabel, TaskStatusBadge } from "../components/TableCells";
import { BackLink, Page, PageLoading } from "../components/PageUI";

const LABELS = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  CS_TICKET: "CS ticket",
  IT_TICKET: "IT ticket",
  COMPLETED: "Completed",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const AdminTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({});
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const { lastEvent } = useNotification();
  const location = useLocation();
  const [loading, setLoadong] = useState(true);

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
        setLoadong(true);
        const response = await axios.get(
          `${BACKEND_URL}/admindata/task/${id}`,
          {
            withCredentials: true,
          },
        );
        setUsers(response.data.users);
        setTask(response.data.task);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      } finally {
        setLoadong(false);
      }
    };

    getTask();
  }, [id, location.state?.timestamp]);

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

  useEffect(() => {
    getComments(BACKEND_URL, task.id, setComments);
  }, [task?.id]);

  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.type === "COMMENT" && lastEvent.taskId === task.id) {
      getComments(BACKEND_URL, task.id, setComments);
    }
  }, [lastEvent, task.id]);

  const clean = DOMPurify.sanitize(task.description);

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`${BACKEND_URL}/tasks/edit_task`, formData, {
        withCredentials: true,
      });
      if (res) {
        navigate(-1);
      }
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    }
  };

  if (loading) return <PageLoading />;

  const assignee = users.find((u) => u.id === task.userId);
  const changed =
    formData.status !== task.status ||
    formData.priority !== task.priority ||
    formData.userId !== task.userId;

  return (
    <Page>
      <BackLink to="/dashboard/tasks/ALL">Back to tasks</BackLink>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <TaskStatusBadge status={task.status} />
          <PriorityLabel priority={task.priority} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="size-4" />
            {task.client?.name ?? "No client"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-4" />
            {assignee
              ? `${assignee.firstname} ${assignee.lastname}`
              : "Unassigned"}
          </span>
          {task.createdAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Created {format(new Date(task.createdAt), "d MMM yyyy, HH:mm")}
            </span>
          )}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Description + comments */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {task.description ? (
                <div
                  className="rte flex flex-col gap-4 text-left"
                  dangerouslySetInnerHTML={{ __html: clean }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No description.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="size-4" />
                Comments
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {comments.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <CommentInput taskID={task?.id} setComments={setComments} />
              {comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No comments yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {comments.map((comm) => (
                    <CommentCard
                      key={comm.id}
                      comment={comm}
                      setComments={setComments}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manage */}
        <Card className="lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="text-base">Manage task</CardTitle>
            <CardDescription>Reassign it or change its status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <FormField label="Assignee">
                {(id) => (
                  <Select
                    value={formData.userId}
                    onValueChange={(value) =>
                      setFormData((p) => ({ ...p, userId: value }))
                    }
                  >
                    <SelectTrigger id={id} className="h-10 w-full">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstname} {user.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <FormField label="Status">
                {(id) => (
                  <SelectInput
                    id={id}
                    value={formData.status}
                    onChange={(value) =>
                      setFormData((p) => ({ ...p, status: value }))
                    }
                    options={STATUS}
                    format={(v) => LABELS[v]}
                    placeholder="Select status"
                  />
                )}
              </FormField>
              <FormField label="Priority">
                {(id) => (
                  <SelectInput
                    id={id}
                    value={formData.priority}
                    onChange={(value) =>
                      setFormData((p) => ({ ...p, priority: value }))
                    }
                    options={PRIORITY}
                    format={(v) => LABELS[v]}
                    placeholder="Select priority"
                  />
                )}
              </FormField>
              <Button type="submit" className="w-full" disabled={!changed}>
                <Save />
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default AdminTask;
