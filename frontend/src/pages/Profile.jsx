import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  AtSign,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock,
  History,
  KeyRound,
  ListChecks,
  Mail,
  MessageSquare,
  Rocket,
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

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (value) =>
  value ? format(new Date(value), "d MMM yyyy") : "—";

const timeAgo = (value) =>
  value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : "—";

const initials = (user) =>
  [user?.firstname, user?.lastname]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";

// Comments are stored as HTML; show them as plain text
const toPlainText = (html = "") =>
  new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ??
  "";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// ─── small building blocks ──────────────────────────────────────────────────

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4" />
      {label}
    </dt>
    <dd className="truncate text-right text-sm font-medium">{children}</dd>
  </div>
);

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

const SectionCard = ({ title, description, action, children }) => (
  <Card>
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div className="space-y-1">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const Empty = ({ children }) => (
  <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>
);

const HighPriorityAlert = ({ count, children }) =>
  count > 0 && (
    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      <AlertTriangle className="size-4 shrink-0" />
      {children}
    </div>
  );

const ICON_TONES = {
  primary: "bg-primary/15 text-primary",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300",
  red: "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-300",
};

// ─── SUPPORT: works tasks ───────────────────────────────────────────────────

const SupportActivity = ({ stats }) => (
  <>
    <DetailRow icon={Clock} label="Last task activity">
      {timeAgo(stats.lastActivity)}
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
  </>
);

const SupportOverview = ({ stats }) => {
  const open = stats.todo + stats.inProgress;
  const tickets = stats.csTicket + stats.itTicket;
  const completionRate = stats.totalTasks
    ? Math.round((stats.completed / stats.totalTasks) * 100)
    : 0;

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
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          icon={ListChecks}
          label="Total tasks"
          value={stats.totalTasks}
          iconClass={ICON_TONES.primary}
        />
        <StatTile
          icon={CircleDot}
          label="Open"
          value={open}
          hint="To do + in progress"
          iconClass={ICON_TONES.blue}
        />
        <StatTile
          icon={Ticket}
          label="Tickets"
          value={tickets}
          hint={`${stats.csTicket} CS · ${stats.itTicket} IT`}
          iconClass={ICON_TONES.amber}
        />
        <StatTile
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          hint={`${completionRate}% of all tasks`}
          iconClass={ICON_TONES.emerald}
        />
      </div>

      <HighPriorityAlert count={stats.highPriorityOpen}>
        {plural(stats.highPriorityOpen, "high-priority task is", "high-priority tasks are")}{" "}
        still open.
      </HighPriorityAlert>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Tasks by status" description="All your tasks">
          <DonutChart items={chartItems} emptyMessage="No tasks yet" />
        </SectionCard>

        <SectionCard
          title="Top clients"
          description="Clients you work with most"
        >
          {stats.topClients.length === 0 ? (
            <Empty>No client tasks yet</Empty>
          ) : (
            <ul className="space-y-4">
              {stats.topClients.map((client) => (
                <li key={client.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{client.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {plural(client.count, "task", "tasks")}
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
        </SectionCard>
      </div>

      <SectionCard title="Recent tasks" description="Your last updated tasks">
        {stats.recentTasks.length === 0 ? (
          <Empty>No tasks yet</Empty>
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
                    {timeAgo(task.updatedAt)}
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
      </SectionCard>
    </>
  );
};

// ─── ADMIN / MANAGER: comments on and manages tasks, writes content ─────────

const StaffActivity = ({ stats }) => (
  <>
    <DetailRow icon={Clock} label="Last activity">
      {timeAgo(stats.lastActivity)}
    </DetailRow>
    <DetailRow icon={MessageSquare} label="Comments (7 days)">
      {stats.commentsLast7Days}
    </DetailRow>
    <DetailRow icon={BookOpen} label="Guides published">
      {stats.guidesPublished} of {stats.guidesWritten}
    </DetailRow>
    <DetailRow icon={Rocket} label="Features released">
      {stats.featuresReleased} of {stats.featuresWritten}
    </DetailRow>
  </>
);

const StaffOverview = ({ stats }) => {
  const navigate = useNavigate();
  const { team } = stats;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          icon={MessageSquare}
          label="Comments"
          value={stats.commentsWritten}
          hint={`${stats.commentsLast7Days} in the last 7 days`}
          iconClass={ICON_TONES.primary}
        />
        <StatTile
          icon={ListChecks}
          label="Tasks followed"
          value={stats.tasksCommentedOn}
          hint="Tasks you commented on"
          iconClass={ICON_TONES.blue}
        />
        <StatTile
          icon={BookOpen}
          label="Guides & features"
          value={stats.guidesWritten + stats.featuresWritten}
          hint={`${stats.guidesWritten} guides · ${stats.featuresWritten} features`}
          iconClass={ICON_TONES.violet}
        />
        <StatTile
          icon={Building2}
          label="Clients added"
          value={stats.clientsAdded}
          iconClass={ICON_TONES.emerald}
        />
      </div>

      <SectionCard
        title="Team right now"
        description="Open work across all support agents"
        action={
          <Link
            to="/dashboard"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Dashboard
            <ArrowRight className="size-4" />
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Open tasks", value: team.open, dot: "bg-blue-500", href: "/dashboard/tasks/pending" },
            { label: "Jira tickets", value: team.tickets, dot: "bg-amber-500", href: "/dashboard/tasks/JIRA_TICKET" },
            { label: "High priority open", value: team.highPriorityOpen, dot: "bg-red-500", href: "/dashboard/tasks/priority" },
            { label: "New this week", value: team.createdLast7Days, dot: "bg-emerald-500", href: "/dashboard/tasks/ALL" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="rounded-lg border p-3 transition hover:bg-muted/50"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
                <span className={cn("size-2 rounded-full", item.dot)} />
                {item.value}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Recent comments"
          description="Your latest comments on tasks"
        >
          {stats.recentComments.length === 0 ? (
            <Empty>No comments yet</Empty>
          ) : (
            <ul className="divide-y">
              {stats.recentComments.map((comment) => (
                <li key={comment.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/task/${comment.task.id}`)}
                    className="flex w-full flex-col gap-1.5 rounded-md py-3 text-left transition hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {comment.task.title}
                      </span>
                      <TaskStatusBadge status={comment.task.status} />
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {toPlainText(comment.description) || "(empty comment)"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Recent guides & features"
          description="Content you wrote"
        >
          {stats.recentContent.length === 0 ? (
            <Empty>Nothing written yet</Empty>
          ) : (
            <ul className="divide-y">
              {stats.recentContent.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={`/${item.type === "guide" ? "guides" : "features"}/${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-md py-3 transition hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          item.type === "guide" ? ICON_TONES.violet : ICON_TONES.blue,
                        )}
                      >
                        {item.type === "guide" ? (
                          <BookOpen className="size-4" />
                        ) : (
                          <Rocket className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === "guide" ? "Guide" : "Feature"} ·{" "}
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        item.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  );
};

// ─── page ───────────────────────────────────────────────────────────────────

const Profile = () => {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const [stats, setStats] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/stats/users/${user.id}`,
          { withCredentials: true },
        );
        setStats(response.data);
      } catch {
        // the error toast (axios interceptor) shows what went wrong
      }
    };
    getStats();
  }, []);

  const handleToggleModal = () => setModal(!modal);
  const isStaff = stats?.kind === "staff";

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
          <SectionCard title="Account details">
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
          </SectionCard>

          {stats && (
            <SectionCard title="Activity">
              <dl className="divide-y">
                {isStaff ? (
                  <StaffActivity stats={stats} />
                ) : (
                  <SupportActivity stats={stats} />
                )}
              </dl>
            </SectionCard>
          )}
        </div>

        {/* Right two columns: depends on role */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {!stats ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Loading…
              </CardContent>
            </Card>
          ) : isStaff ? (
            <StaffOverview stats={stats} />
          ) : (
            <SupportOverview stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
