import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const AdminTasks = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { type } = useParams();
  const [, setSomeData] = useState([]);

  useEffect(() => {
    const testData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/tasks/${type}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setSomeData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    testData();
  }, []);

  return <div>AdminTasks</div>;
};

export default AdminTasks;
