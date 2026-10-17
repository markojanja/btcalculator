import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import { taskKeys } from "../api/tasks";
import { adminKeys } from "../api/admin";

// Shows server notifications as toasts and marks the data they affect as
// stale, so any page displaying it refetches.
const NotificationListener = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // The session cookie authenticates the socket; the server assigns rooms.
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    socket.on("notification", (event) => {
      if (event.type === "COMMENT") {
        queryClient.invalidateQueries({
          queryKey: taskKeys.comments(event.taskId),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: taskKeys.all });
        queryClient.invalidateQueries({ queryKey: adminKeys.all });
      }

      const canOpenTask = isStaff(user) && event.type !== "TASK_DELETED";
      toast.info(
        <div className="flex flex-col text-left">
          {event.message}
          {canOpenTask && (
            <Link
              className="font-bold self-end"
              to={`/dashboard/task/${event.taskId}`}
            >
              View task
            </Link>
          )}
        </div>,
      );
    });

    return () => socket.disconnect();
  }, [user, queryClient]);

  return null;
};

export default NotificationListener;
