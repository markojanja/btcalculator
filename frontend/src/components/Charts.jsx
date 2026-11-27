import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Theme colours (defined per colour scheme in index.css), reused in a cycle
// for data without a fixed colour, e.g. users or clients.
const THEME_COLORS = [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`);

/**
 * Turns [{ label, value, color? }] into what shadcn charts expect:
 * rows with a CSS-safe key, and a config mapping each key to label + colour.
 */
const toChartData = (items) => {
  const config = { value: { label: "Tasks" } };
  const rows = items.map((item, i) => {
    const key = `item${i}`;
    config[key] = {
      label: item.label,
      color: item.color ?? THEME_COLORS[i % THEME_COLORS.length],
    };
    return { key, label: item.label, value: item.value };
  });
  return { rows, config };
};

export const ChartEmpty = ({ message = "No data at the moment" }) => (
  <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
    {message}
  </div>
);

/**
 * Donut chart with the total in the middle and a legend below.
 *
 * The donut has its own square box and the total is an HTML overlay centred
 * on that box, so it stays centred no matter how long the legend is.
 */
export const DonutChart = ({ items, totalLabel = "Tasks", emptyMessage }) => {
  const nonZero = items.filter((item) => item.value > 0);
  if (nonZero.length === 0) return <ChartEmpty message={emptyMessage} />;

  const { rows, config } = toChartData(nonZero);
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-60">
        <ChartContainer config={config} className="aspect-square h-full w-full">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="key" />}
            />
            <Pie
              data={rows}
              dataKey="value"
              nameKey="key"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="95%"
              paddingAngle={rows.length > 1 ? 2 : 0}
              strokeWidth={2}
            >
              {rows.map((row) => (
                <Cell key={row.key} fill={`var(--color-${row.key})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold leading-none tabular-nums">
            {total}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {totalLabel}
          </span>
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: config[row.key].color }}
            />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Horizontal bar chart, one bar per item, value at the end of each bar. */
export const HorizontalBarChart = ({ items, emptyMessage }) => {
  if (items.every((item) => !item.value)) {
    return <ChartEmpty message={emptyMessage} />;
  }

  const { rows, config } = toChartData(items);

  return (
    <ChartContainer config={config} className="h-[250px] w-full">
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 32 }}>
        <YAxis
          dataKey="key"
          type="category"
          tickLine={false}
          axisLine={false}
          width={70}
          tickFormatter={(key) => config[key]?.label}
        />
        <XAxis dataKey="value" type="number" hide allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="key" />}
        />
        <Bar dataKey="value" radius={6} barSize={28}>
          {rows.map((row) => (
            <Cell key={row.key} fill={`var(--color-${row.key})`} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            className="fill-foreground text-sm font-medium"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
