import { useEffect, useId } from "react";
import ReactMarkdown from "react-markdown";
import { CircleHelp, Globe, PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Shared layout and inputs for the calculator and converter pages.

/** Full-screen help overlay showing a markdown how-to. */
export const HelpDialog = ({ title, content, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} help`}
    >
      <Card
        className="relative w-full max-w-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CircleHelp className="size-5 text-primary" />
            How to use: {title}
          </CardTitle>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close help">
            <X />
          </Button>
        </CardHeader>
        <CardContent className="prose-help max-h-[70vh] overflow-y-auto text-sm leading-relaxed [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:text-foreground [&_ul]:mb-3">
          <ReactMarkdown>{content}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Page frame: icon, title, description, help button and an optional action
 * (e.g. the live-rates switch). Children are laid out in two columns on
 * large screens: the form on the left, results on the right.
 */
export const CalculatorPage = ({
  icon: Icon,
  title,
  description,
  onHelp,
  action,
  children,
}) => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 text-left sm:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onHelp && (
          <Button variant="outline" size="sm" onClick={onHelp}>
            <CircleHelp />
            How it works
          </Button>
        )}
      </div>
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-5">{children}</div>
  </div>
);

/** Left column: the inputs. */
export const FormCard = ({ children, onSubmit, submitLabel = "Calculate", submitting, footer }) => (
  <Card className="lg:col-span-3">
    <CardContent>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        noValidate
      >
        {children}
        {footer}
        {onSubmit && (
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitLabel}
          </Button>
        )}
      </form>
    </CardContent>
  </Card>
);

/** A titled group of fields inside the form. */
export const FormSection = ({ title, children, columns = 2 }) => (
  <fieldset className="space-y-3">
    {title && (
      <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
    )}
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {children}
    </div>
  </fieldset>
);

/** Label + control + optional hint. `render(id)` gets the input id. */
export const FormField = ({ label, hint, className, children }) => {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {typeof children === "function" ? children(id) : children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

const NO_SPINNERS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/** Number input without browser spinners, optional unit on the right. */
export const NumberInput = ({ unit, className, ...props }) => (
  <div className="relative">
    <Input
      type="number"
      inputMode="decimal"
      step="any"
      className={cn("h-10 tabular-nums", NO_SPINNERS, unit && "pr-14", className)}
      {...props}
    />
    {unit && (
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
        {unit}
      </span>
    )}
  </div>
);

/** Select from a list of strings. */
export const SelectInput = ({ id, value, onChange, options, placeholder, format }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger id={id} className="h-10 w-full">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="max-h-72">
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {format ? format(option) : option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/** Two-or-more option switch (e.g. BUY / SELL, Forex / CFD). */
export const SegmentedControl = ({ value, onChange, options, format }) => (
  <div className="inline-flex h-10 w-full rounded-md bg-muted p-1">
    {options.map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        aria-pressed={value === option}
        className={cn(
          "flex-1 rounded-sm px-3 text-sm font-medium transition",
          value === option
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {format ? format(option) : option}
      </button>
    ))}
  </div>
);

/**
 * Switch between live rates (fetched online) and manual entry.
 * `manual` = true means the user types rates in.
 */
export const RateModeToggle = ({ manual, onChange }) => (
  <div className="inline-flex h-9 rounded-md bg-muted p-1 text-sm">
    {[
      { value: false, label: "Live rates", icon: Globe },
      { value: true, label: "Manual", icon: PencilLine },
    ].map(({ value, label, icon: Icon }) => (
      <button
        key={label}
        type="button"
        onClick={() => onChange(value)}
        aria-pressed={manual === value}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm px-3 font-medium transition",
          manual === value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    ))}
  </div>
);

/** Right column: results. Shows `empty` until there is something to show. */
export const ResultCard = ({ title = "Result", empty, children, className }) => (
  <Card className={cn("lg:sticky lg:top-20 lg:col-span-2", className)}>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children || (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          {empty}
        </div>
      )}
    </CardContent>
  </Card>
);

/** Big highlighted number, e.g. the pip value. `tone` colours it. */
export const ResultValue = ({ label, value, unit, tone = "default", note }) => (
  <div
    className={cn(
      "rounded-xl p-5",
      tone === "default" && "bg-primary/10",
      tone === "positive" && "bg-emerald-50 dark:bg-emerald-950/40",
      tone === "negative" && "bg-red-50 dark:bg-red-950/40",
    )}
  >
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={cn(
        "mt-1 break-all text-4xl font-bold tabular-nums tracking-tight",
        tone === "default" && "text-primary",
        tone === "positive" && "text-emerald-600 dark:text-emerald-400",
        tone === "negative" && "text-red-600 dark:text-red-400",
      )}
    >
      {value}
      {unit && (
        <span className="ml-2 text-lg font-semibold text-muted-foreground">
          {unit}
        </span>
      )}
    </p>
    {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
  </div>
);

/** Label/value list under a result. `rows` = [[label, value], …]. */
export const ResultDetails = ({ rows }) => (
  <dl className="mt-4 divide-y text-sm">
    {rows.map(([label, value]) => (
      <div key={label} className="flex items-center justify-between gap-4 py-2">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="text-right font-medium tabular-nums">{value}</dd>
      </div>
    ))}
  </dl>
);
