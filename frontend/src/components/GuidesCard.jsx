import { format } from "date-fns";
import { BookOpen, CalendarDays, UserRound } from "lucide-react";
import { LinkCard, Pill } from "./PageUI";

// Guide bodies are HTML; show a short plain-text preview
const preview = (html = "") =>
  new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ??
  "";

const GuidesCard = ({ guide }) => {
  const text = preview(guide.description);

  return (
    <LinkCard to={`/guides/${guide.id}`}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
          <BookOpen className="size-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="line-clamp-2 font-semibold leading-snug">
            {guide.title}
          </p>
          {!guide.published && <Pill>Draft</Pill>}
        </div>
      </div>

      {text && (
        <p className="line-clamp-3 text-sm text-muted-foreground">{text}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {format(new Date(guide.createdAt), "d MMM yyyy")}
        </span>
        <span className="inline-flex items-center gap-1.5 truncate">
          <UserRound className="size-3.5" />
          {guide.user?.username ?? "—"}
        </span>
      </div>
    </LinkCard>
  );
};

export default GuidesCard;
