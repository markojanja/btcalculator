import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "Notification context must be used within NotificationProvider "
    );
  }

  return context;
};

export default useNotification;
