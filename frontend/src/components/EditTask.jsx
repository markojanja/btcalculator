import axios from "axios";
import { useState, useEffect } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import useKanban from "../hooks/useKanban";
import useCloudinary from "../hooks/useCloudinary";
import useNotification from "../hooks/useNotification";
import { getComments } from "../utils/fetchData.js";
import { Button } from "@/components/ui/button";
import { Dialog } from "./PageUI";
import TaskFields from "./TaskFields";
import CommentInput from "./CommentInput";
import CommentCard from "./CommentCard";

const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

const EditTask = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { toggleEditTaskModal, updateTask, deleteTask, activeTask, getTasks } =
    useKanban();
  const { uploadImage } = useCloudinary();
  const { lastEvent } = useNotification();

  const [title, setTitle] = useState(activeTask?.title ?? "");
  const [content, setContent] = useState(activeTask?.description ?? "");
  const [status, setStatus] = useState(activeTask?.status ?? STATUS[0]);
  const [priority, setPriority] = useState(activeTask?.priority ?? PRIORITY[0]);
  const [client, setClient] = useState(activeTask?.clientId ?? "");
  const [activeClients, setActiveClients] = useState([]);
  const [comments, setComments] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  // A completed task can still be opened; keep its status selectable
  const statuses = STATUS.includes(status) ? STATUS : [...STATUS, status];

  useEffect(() => {
    const getActiveClients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/clients/active`, {
          withCredentials: true,
        });
        setActiveClients(res.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      }
    };
    getActiveClients();
  }, [BACKEND_URL]);

  useEffect(() => {
    getComments(BACKEND_URL, activeTask.id, setComments);
  }, [activeTask?.id]);

  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === "COMMENT" && lastEvent.taskId === activeTask?.id) {
      getComments(BACKEND_URL, activeTask.id, setComments);
    }
  }, [lastEvent, activeTask?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedTask = {
        ...activeTask,
        title,
        client,
        description: content,
        status,
        priority,
      };
      // optimistic update
      updateTask(updatedTask);
      await axios.put(`${BACKEND_URL}/tasks/edit_task`, updatedTask, {
        withCredentials: true,
      });
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSaving(false);
      await getTasks();
      toggleEditTaskModal();
    }
  };

  const handleDelete = () => {
    deleteTask(activeTask);
    toggleEditTaskModal();
  };

  return (
    <Dialog
      title="Edit task"
      description={activeTask?.client?.name ?? undefined}
      onClose={toggleEditTaskModal}
      size="lg"
    >
      <div className="flex flex-col gap-8">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <TaskFields
            title={title}
            setTitle={setTitle}
            client={client}
            setClient={setClient}
            clients={activeClients}
            content={content}
            setContent={setContent}
            uploadImage={uploadImage}
            status={status}
            setStatus={setStatus}
            statuses={statuses}
            priority={priority}
            setPriority={setPriority}
            priorities={PRIORITY}
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Delete needs a second click to confirm */}
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Delete this task?
                </span>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Yes, delete
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 />
                Delete task
              </Button>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={toggleEditTaskModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </form>

        <section className="space-y-4 border-t pt-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="size-4" />
            Comments
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {comments.length}
            </span>
          </h3>
          <CommentInput taskID={activeTask?.id} setComments={setComments} />
          {comments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No comments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((comm) => (
                <CommentCard key={comm.id} comment={comm} setComments={setComments} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Dialog>
  );
};

export default EditTask;
