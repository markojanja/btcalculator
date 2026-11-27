import { CalendarDays, Mail } from "lucide-react";
import { format } from "date-fns";
import { LinkCard } from "./PageUI";
import { RoleBadge } from "./TableCells";
import { cn } from "@/lib/utils";

const initials = (user) =>
  [user.firstname, user.lastname]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "?";

const UsersCard = ({ user }) => (
  <LinkCard to={`/users/edit/${user.id}`}>
    <div className="flex items-start gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {initials(user)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {user.firstname} {user.lastname}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          @{user.username}
        </p>
      </div>
      <RoleBadge role={user.role} />
    </div>

    <div className="space-y-1.5 text-sm text-muted-foreground">
      <p className="flex items-center gap-2 truncate">
        <Mail className="size-4 shrink-0" />
        <span className="truncate">{user.email}</span>
      </p>
      <p className="flex items-center gap-2">
        <CalendarDays className="size-4 shrink-0" />
        Joined {format(new Date(user.createdAt), "d MMM yyyy")}
      </p>
    </div>

    <div className="mt-auto flex items-center gap-1.5 text-xs font-medium">
      <span
        className={cn(
          "size-2 rounded-full",
          user.active ? "bg-emerald-500" : "bg-red-500",
        )}
      />
      {user.active ? "Active" : "Inactive"}
    </div>
  </LinkCard>
);

export default UsersCard;
