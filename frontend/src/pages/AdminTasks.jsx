import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ListChecks } from "lucide-react";
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
import useSearch from "../hooks/useSearch";
import {
  ListToolbar,
  Page,
  PageHeader,
  Pager,
  SearchBox,
} from "../components/PageUI";

// Page titles for the task list filters (see adminData.controller.js)
const TITLES = {
  ALL: ["All tasks", "Every task on the board."],
  pending: ["Pending tasks", "To do and in progress."],
  priority: ["Open tasks by priority", "To do and in progress, highest priority first."],
  JIRA_TICKET: ["Jira tickets", "Tasks escalated as CS or IT tickets."],
  TODO: ["To do", "Tasks waiting to be picked up."],
  IN_PROGRESS: ["In progress", "Tasks being worked on."],
  CS_TICKET: ["CS tickets", "Tasks escalated to customer support."],
  IT_TICKET: ["IT tickets", "Tasks escalated to IT."],
  COMPLETED: ["Completed", "Finished tasks."],
};

const AdminTasks = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { type } = useParams();
  const [tasks, setTasks] = useState([]);

  const { query, setQuery, filtered } = useSearch(tasks, [
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
      setTasks(response.data.tasks);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    }
  };

  // Reload when the filter in the URL changes or a notification arrives
  useEffect(() => {
    getData();
  }, [type, lastEvent]);

  const [title, description] = TITLES[type] ?? [type, ""];

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader icon={ListChecks} title={title} description={description} />
      <ListToolbar
        search={
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search task, client, assignee…"
          />
        }
        count={filtered.length}
        noun="task"
      />
      <div>
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
      <Pager pageCount={pageCount} onPageChange={handlePageChange} />
    </Page>
  );
};

export default AdminTasks;
