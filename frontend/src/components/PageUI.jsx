import { useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Shared layout pieces for regular pages (lists, details, forms).

/** Centred page column. `size` controls the max width. */
export const Page = ({ size = "xl", className, children }) => (
  <div
    className={cn(
      "mx-auto flex w-full flex-col gap-6 p-4 text-left sm:p-6",
      size === "sm" && "max-w-2xl",
      size === "md" && "max-w-4xl",
      size === "xl" && "max-w-6xl",
      className,
    )}
  >
    {children}
  </div>
);

/** "← Back to …" link above a page header. */
export const BackLink = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ChevronLeft className="size-4" />
    {children}
  </Link>
);

/** Spinner for a page section that is loading. */
export const PageLoading = () => (
  <div className="flex flex-1 items-center justify-center py-24">
    <span className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
);

/** Icon, title, description on the left; actions on the right. */
export const PageHeader = ({ icon: Icon, title, description, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex items-start gap-4">
      {Icon && (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
      )}
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
    )}
  </div>
);

/** Primary "New …" button that links somewhere. */
export const NewButton = ({ to, children }) => (
  <Button asChild>
    <Link to={to}>
      <Plus />
      {children}
    </Link>
  </Button>
);

/** Search box with an icon and a clear button; filters as you type. */
export const SearchBox = ({ value, onChange, placeholder = "Search…", className }) => (
  <div className={cn("relative w-full sm:max-w-xs", className)}>
    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
      aria-label={placeholder}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Clear search"
      >
        <X className="size-4" />
      </button>
    )}
  </div>
);

/** Search on the left, item count on the right. */
export const ListToolbar = ({ search, count, noun }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {search}
    <p className="text-sm text-muted-foreground">
      {count} {count === 1 ? noun : `${noun}s`}
    </p>
  </div>
);

/** Responsive grid of cards. */
export const CardGrid = ({ children }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);

/** Placeholder cards while a list loads. */
export const SkeletonGrid = ({ count = 6 }) => (
  <CardGrid>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="space-y-3 rounded-xl border p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    ))}
  </CardGrid>
);

/** Shown when a list is empty. */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
    {Icon && (
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
    )}
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);

const pageLink =
  "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm transition-colors hover:bg-muted";

/** Page numbers; hidden when there is only one page. */
export const Pager = ({ pageCount, onPageChange }) => {
  if (pageCount <= 1) return null;
  return (
    <ReactPaginate
      breakLabel="…"
      previousLabel={<ChevronLeft className="size-4" />}
      nextLabel={<ChevronRight className="size-4" />}
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      containerClassName="flex items-center justify-center gap-1 pt-2"
      pageLinkClassName={pageLink}
      previousLinkClassName={pageLink}
      nextLinkClassName={pageLink}
      breakLinkClassName={pageLink}
      activeLinkClassName="bg-primary text-primary-foreground hover:bg-primary"
      disabledLinkClassName="pointer-events-none opacity-40"
      previousAriaLabel="Previous page"
      nextAriaLabel="Next page"
    />
  );
};

/** Card that links somewhere, with hover lift. */
export const LinkCard = ({ to, className, children }) => (
  <Link
    to={to}
    className={cn(
      "group flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition",
      "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
  >
    {children}
  </Link>
);

/**
 * Modal dialog over a dimmed page. Closes on Escape, the ✕ button or a
 * click outside. `size`: sm | md | lg.
 */
export const Dialog = ({ title, description, onClose, size = "md", children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // no page scroll behind the dialog
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-6"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "relative w-full rounded-xl border bg-card text-left text-card-foreground shadow-xl",
            size === "sm" && "max-w-md",
            size === "md" && "max-w-2xl",
            size === "lg" && "max-w-4xl",
          )}
        >
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold leading-tight">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X />
            </Button>
          </div>
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

/** Back link, header and a card around a form. */
export const FormPage = ({ backTo, backLabel, icon, title, description, children }) => (
  <Page size="md">
    <BackLink to={backTo}>{backLabel}</BackLink>
    <PageHeader icon={icon} title={title} description={description} />
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      {children}
    </div>
  </Page>
);

/** Cancel + submit buttons at the bottom of a form. */
export const FormActions = ({ cancelTo, submitLabel, submitting, disabled }) => (
  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
    <Button type="button" variant="outline" asChild>
      <Link to={cancelTo}>Cancel</Link>
    </Button>
    <Button type="submit" disabled={submitting || disabled}>
      {submitting ? "Saving…" : submitLabel}
    </Button>
  </div>
);

/** On/off option with a title and an explanation. */
export const ToggleRow = ({ id, title, description, checked, onChange, disabled }) => (
  <label
    htmlFor={id}
    className={cn(
      "flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40",
      disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
    )}
  >
    <span className="space-y-0.5">
      <span className="block text-sm font-medium">{title}</span>
      {description && (
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </span>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  </label>
);

/** Pick several options from a list of chips. */
export const ChipSelect = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const selected = value.includes(option);
      return (
        <button
          key={option}
          type="button"
          aria-pressed={selected}
          onClick={() =>
            onChange(
              selected ? value.filter((v) => v !== option) : [...value, option],
            )
          }
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);

/** Small coloured pill. */
export const Pill = ({ tone = "muted", children }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
      tone === "muted" && "bg-muted text-muted-foreground",
      tone === "green" &&
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
      tone === "blue" &&
        "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      tone === "amber" &&
        "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
      tone === "primary" && "bg-primary/15 text-primary",
    )}
  >
    {children}
  </span>
);
