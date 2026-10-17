import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminTasks } from "../api/admin";
import { formatDate } from "../lib/format";
import ListPage from "../components/ListPage";

const AdminTasks = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useAdminTasks(type);

  return (
    <ListPage
      title={`Tasks (${data?.page_title ?? type})`}
      items={data?.tasks}
      isLoading={isLoading}
      searchKeys={["title", "status", "priority", "client.name", "user.firstname"]}
      pageSize={20}
      emptyText="No tasks"
    >
      {(page) => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer"
                onClick={() => navigate(`/dashboard/task/${task.id}`)}
              >
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  {task.client && <Badge>{task.client.name}</Badge>}
                </TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell>
                  {task.user.firstname} {task.user.lastname}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ListPage>
  );
};

export default AdminTasks;
