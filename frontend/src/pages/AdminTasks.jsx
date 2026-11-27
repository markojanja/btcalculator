import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import useNotification from "../hooks/useNotification";
import { TableCell } from "@/components/ui/table";
import {
  ClickableRow,
  DataTable,
  DateCell,
  EmptyRow,
  PersonCell,
  PriorityLabel,
  TaskStatusBadge,
} from "../components/TableCells";
import SearchInput from "../components/SearchInput";
import useSearch from "../hooks/useSearch";

const AdminTasks = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { type } = useParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const { query, setQuery, filtered, handleSearch } = useSearch(tasks, [
    "title",
    "status",
    "priority",
    "client.name",
    "user.firstname",
  ]);

  const { lastEvent } = useNotification();

  const { currentItems, pageCount, handlePageChange } = usePagination(
    filtered,
    20,
  );

  const getData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admindata/tasks/${type}`,
        {
          withCredentials: true,
        },
      );
      setTitle(response.data.page_title);
      setTasks(response.data.tasks);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [lastEvent]);

  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col w-full p-6">
      <div className="flex justify-between items-start border-b border-b-muted py-3">
        <h2 className="text-2xl font-bold">Tasks ({title})</h2>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
        />
      </div>
      <div className="flex flex-col flex-1 items-center">
        <div className="w-full">
          <DataTable
            columns={[
              "Task",
              "Client",
              "Status",
              "Priority",
              "Created",
              "Assignee",
            ]}
          >
            {currentItems.length === 0 && (
              <EmptyRow colSpan={6}>No tasks found</EmptyRow>
            )}
            {currentItems.map((task) => (
              <ClickableRow
                key={task.id}
                onOpen={() => navigate(`/dashboard/task/${task.id}`)}
              >
                <TableCell className="max-w-72 truncate font-medium">
                  {task.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {task.client?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityLabel priority={task.priority} />
                </TableCell>
                <TableCell>
                  <DateCell value={task.createdAt} />
                </TableCell>
                <TableCell>
                  <PersonCell
                    firstname={task.user.firstname}
                    lastname={task.user.lastname}
                  />
                </TableCell>
              </ClickableRow>
            ))}
          </DataTable>
        </div>
      </div>
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdminTasks;
