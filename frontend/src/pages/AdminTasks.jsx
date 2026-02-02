import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useNotification from "../hooks/useNotification";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminTasks = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { type } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const { lastEvent } = useNotification();

  const { currentItems, pageCount, handlePageChange } = usePagination(
    tasks,
    20,
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/tasks/${type}`,
          {
            withCredentials: true,
          },
        );
        console.log(response);
        setTitle(response.data.page_title);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admindata/tasks/${type}`,
          {
            withCredentials: true,
          },
        );
        console.log(response);
        setTitle(response.data.page_title);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [lastEvent]);

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Tasks ({title})</h2>
      </div>
      <div className="flex flex-col flex-1 items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Assigne</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  {new Date(task.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {task.user.firstname} {task.user.lastname}
                </TableCell>
                <TableCell>
                  <Link to={`/dashboard/task/${task.id}`}>view task</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdminTasks;
