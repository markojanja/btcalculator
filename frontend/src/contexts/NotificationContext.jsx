import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Join personal room + role room (prepend "role:" to match backend)
    const roleRoom = `role:${user.role}`;
    newSocket.emit("join", { userId: user.id, role: roleRoom });

    console.log("Socket emitted join for user:", user.id, "role:", roleRoom);

    newSocket.on("notification", (data) => {
      console.log("Notification received on frontend:", data); // ✅ frontend logs here
      setNotifications((prev) => [data, ...prev]);

      toast.info(data.message);
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
