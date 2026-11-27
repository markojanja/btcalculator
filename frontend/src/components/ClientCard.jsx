import { Building2, Server, UserRound } from "lucide-react";
import { LinkCard, Pill } from "./PageUI";
import { ClientStatusLabel } from "./TableCells";

const Body = ({ client }) => (
  <>
    <div className="flex items-start gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{client.name}</p>
        <ClientStatusLabel status={client.status} />
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-1.5">
      {client.platform.map((p) => (
        <Pill key={p} tone="primary">
          {p}
        </Pill>
      ))}
    </div>

    <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Server className="size-3.5" />
        <span className="font-mono">{client.server.join(", ") || "—"}</span>
      </span>
      {client.user?.username && (
        <span className="inline-flex items-center gap-1.5 truncate">
          <UserRound className="size-3.5" />
          {client.user.username}
        </span>
      )}
    </div>
  </>
);

/** Links to `to` when given (staff can edit); otherwise a plain card. */
const ClientCard = ({ client, to }) =>
  to ? (
    <LinkCard to={to}>
      <Body client={client} />
    </LinkCard>
  ) : (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <Body client={client} />
    </div>
  );

export default ClientCard;
