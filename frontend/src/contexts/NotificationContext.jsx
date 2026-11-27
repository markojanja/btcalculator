import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // The session cookie identifies the user; the server picks the rooms.
    const newSocket = io(`${BACKEND_URL}`, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("notification", (data) => {
      // console.log("Notification received on frontend:", data);
      setNotifications((prev) => [data, ...prev]);

      toast.info(
        <div className="flex flex-col text-left">
          {data.message}
          {user.role === "ADMIN" && data.type !== "TASK_DELETED" && (
            <Link
              className="font-bold self-end"
              to={`/dashboard/task/${data.taskId}`}
              state={{ timestamp: Date.now() }}
            >
              View task
            </Link>
          )}
        </div>,
      );
      setLastEvent(data);
    });

    return () => newSocket.disconnect();
  }, [user]);

  const addNotification = (notification) => {
    console.log("Manually adding notification:", notification);
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, socket, lastEvent }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
