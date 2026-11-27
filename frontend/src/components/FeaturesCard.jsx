import { format } from "date-fns";
import { CalendarDays, Rocket, UserRound } from "lucide-react";
import { LinkCard, Pill } from "./PageUI";

const date = (value) => (value ? format(new Date(value), "d MMM yyyy") : "—");

const FeaturesCard = ({ feature }) => (
  <LinkCard to={`/features/${feature.id}`}>
    <div className="flex items-start gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
        <Rocket className="size-5" />
      </span>
      <p className="line-clamp-2 flex-1 font-semibold leading-snug">
        {feature.title}
      </p>
    </div>

    <div className="flex flex-wrap gap-1.5">
      <Pill tone={feature.released ? "green" : "amber"}>
        {feature.released ? "Released" : "Upcoming"}
      </Pill>
      {!feature.published && <Pill>Draft</Pill>}
    </div>

    <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" />
        {date(feature.releaseDate)}
      </span>
      <span className="inline-flex items-center gap-1.5 truncate">
        <UserRound className="size-3.5" />
        {feature.user?.username ?? "—"}
      </span>
    </div>
  </LinkCard>
);

export default FeaturesCard;
