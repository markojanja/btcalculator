import axios from "axios";
import { useEffect, useState } from "react";
import useKanban from "../hooks/useKanban";
import useCloudinary from "../hooks/useCloudinary";
import { Button } from "@/components/ui/button";
import { Dialog } from "./PageUI";
import TaskFields from "./TaskFields";

const STATUS = ["TODO", "IN_PROGRESS", "CS_TICKET", "IT_TICKET"];
const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

// Pre-filled structure for new task descriptions
const TEMPLATE =
  "<strong>Affected platform:</strong><br><br><strong>Problem Description:</strong><br><br><strong>Expected outcome:</strong><br><br><strong>Actions done:</strong><br><br><strong>Result of investigation:</strong><br><br><strong>How to reproduce:</strong><br><br><strong>Logs:</strong><br><br>";

const AddTaskModal = () => {
  const { toggleAddTaskModal, addTask } = useKanban();
  const { uploadImage } = useCloudinary();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(TEMPLATE);
  const [status, setStatus] = useState(STATUS[0]);
  const [priority, setPriority] = useState(PRIORITY[0]);
  const [client, setClient] = useState("");
  const [activeClients, setActiveClients] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${BACKEND_URL}/tasks/add_task`,
        { title, client, description: content, status, priority },
        { withCredentials: true },
      );
      addTask(response.data.task);
      toggleAddTaskModal();
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      title="New task"
      description="Log an issue you're working on."
      onClose={toggleAddTaskModal}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          statuses={STATUS}
          priority={priority}
          setPriority={setPriority}
          priorities={PRIORITY}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={toggleAddTaskModal}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || submitting}>
            {submitting ? "Creating…" : "Create task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddTaskModal;
