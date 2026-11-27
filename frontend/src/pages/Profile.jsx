import { useEffect, useState } from "react";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  AtSign,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock,
  History,
  KeyRound,
  ListChecks,
  Mail,
  MessageSquare,
  Ticket,
  TrendingUp,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import PasswordModal from "../components/PasswordModal";
import { DonutChart } from "../components/Charts";
import {
  PriorityLabel,
  RoleBadge,
  TaskStatusBadge,
} from "../components/TableCells";
import { STATUS_COLORS } from "../utils/chartColors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMPTY_STATS = {
  totalTasks: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
  csTicket: 0,
  itTicket: 0,
  highPriorityOpen: 0,
  createdLast7Days: 0,
  commentsWritten: 0,
  guidesWritten: 0,
  lastActivity: null,
  recentTasks: [],
  topClients: [],
};

const formatDate = (value) =>
  value ? format(new Date(value), "d MMM yyyy") : "—";

const initials = (user) =>
  [user?.firstname, user?.lastname]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";

// Label / value row in the details lists
const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4" />
      {label}
    </dt>
    <dd className="truncate text-right text-sm font-medium">{children}</dd>
  </div>
);

// Small number tile
const StatTile = ({ icon: Icon, label, value, hint, iconClass }) => (
  <Card className="gap-0 py-0">
    <CardContent className="flex items-start justify-between gap-3 p-4 text-left">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          iconClass,
        )}
      >
        <Icon className="size-4.5" />
      </span>
    </CardContent>
  </Card>
);

const Profile = () => {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [stats, setStats] = useState(EMPTY_STATS);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/stats/users/${user.id}`,
          { withCredentials: true },
        );
        setStats({ ...EMPTY_STATS, ...response.data });
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      }
    };
    getStats();
  }, []);

  const handleToggleModal = () => setModal(!modal);

  const open = stats.todo + stats.inProgress;
  const tickets = stats.csTicket + stats.itTicket;
  const completionRate = stats.totalTasks
    ? Math.round((stats.completed / stats.totalTasks) * 100)
    : 0;
  // Task sections are for people who work tasks (SUPPORT, or anyone who has some)
  const showTasks = user.role === "SUPPORT" || stats.totalTasks > 0;

  const chartItems = [
    { label: "To do", value: stats.todo, color: STATUS_COLORS.TODO },
    {
      label: "In progress",
      value: stats.inProgress,
      color: STATUS_COLORS.IN_PROGRESS,
    },
    {
      label: "CS tickets",
      value: stats.csTicket,
      color: STATUS_COLORS.CS_TICKET,
    },
    {
      label: "IT tickets",
      value: stats.itTicket,
      color: STATUS_COLORS.IT_TICKET,
    },
    {
      label: "Completed",
      value: stats.completed,
      color: STATUS_COLORS.COMPLETED,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 text-left">
      {/* Header */}
      <Card className="gap-0 overflow-hidden py-0">
        <div className="h-24 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent" />
        <CardContent className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <span className="-mt-12 flex size-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-card">
              {initials(user)}
            </span>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold leading-tight">
                {user.firstname} {user.lastname}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>@{user.username}</span>
                <span aria-hidden>·</span>
                <RoleBadge role={user.role} />
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      user.active ? "bg-emerald-500" : "bg-red-500",
                    )}
                  />
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleToggleModal}>
            <KeyRound />
            Change password
          </Button>
        </CardContent>
      </Card>

      {modal && <PasswordModal handleToggleModal={handleToggleModal} />}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column: account + activity */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow icon={Mail} label="Email">
                  {user.email}
                </DetailRow>
                <DetailRow icon={AtSign} label="Username">
                  {user.username}
                </DetailRow>
                <DetailRow icon={CircleDot} label="Centroid">
                  {user.centroid ? "Yes" : "No"}
                </DetailRow>
                <DetailRow icon={CalendarDays} label="Member since">
                  {formatDate(user.createdAt)}
                </DetailRow>
                <DetailRow icon={History} label="Profile updated">
                  {formatDate(user.updatedAt)}
                </DetailRow>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow icon={Clock} label="Last task activity">
                  {stats.lastActivity
                    ? formatDistanceToNow(new Date(stats.lastActivity), {
                        addSuffix: true,
                      })
                    : "—"}
                </DetailRow>
                <DetailRow icon={TrendingUp} label="Tasks created (7 days)">
                  {stats.createdLast7Days}
                </DetailRow>
                <DetailRow icon={MessageSquare} label="Comments written">
                  {stats.commentsWritten}
                </DetailRow>
                <DetailRow icon={BookOpen} label="Guides written">
                  {stats.guidesWritten}
                </DetailRow>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right two columns: tasks */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {showTasks ? (
            <>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatTile
                  icon={ListChecks}
                  label="Total tasks"
                  value={stats.totalTasks}
                  iconClass="bg-primary/15 text-primary"
                />
                <StatTile
                  icon={CircleDot}
                  label="Open"
                  value={open}
                  hint="To do + in progress"
                  iconClass="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                />
                <StatTile
                  icon={Ticket}
                  label="Tickets"
                  value={tickets}
                  hint={`${stats.csTicket} CS · ${stats.itTicket} IT`}
                  iconClass="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300"
                />
                <StatTile
                  icon={CheckCircle2}
                  label="Completed"
                  value={stats.completed}
                  hint={`${completionRate}% of all tasks`}
                  iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
                />
              </div>

              {stats.highPriorityOpen > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  {stats.highPriorityOpen} high-priority{" "}
                  {stats.highPriorityOpen === 1 ? "task is" : "tasks are"} still
                  open.
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks by status</CardTitle>
                    <CardDescription>All your tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonutChart items={chartItems} emptyMessage="No tasks yet" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top clients</CardTitle>
                    <CardDescription>Clients you work with most</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.topClients.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No client tasks yet
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {stats.topClients.map((client) => (
                          <li key={client.name} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{client.name}</span>
                              <span className="tabular-nums text-muted-foreground">
                                {client.count}{" "}
                                {client.count === 1 ? "task" : "tasks"}
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${(client.count / stats.topClients[0].count) * 100}%`,
                                }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent tasks</CardTitle>
                  <CardDescription>Your last updated tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentTasks.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No tasks yet
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {stats.recentTasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.client?.name ?? "No client"} · updated{" "}
                              {formatDistanceToNow(new Date(task.updatedAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <PriorityLabel priority={task.priority} />
                            <TaskStatusBadge status={task.status} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                You don&apos;t have any tasks assigned. Task statistics appear
                here once you do.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
