import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js/auto";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, BarElement);

// Evenly spaced hues, so every slice gets its own colour however many there are.
export const palette = (count) =>
  Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 / Math.max(count, 1)) * i + 340) % 360;
    return {
      background: `hsla(${hue}, 75%, 60%, 0.5)`,
      border: `hsla(${hue}, 75%, 60%, 1)`,
    };
  });

// Pie data from [{ <labelKey>, count }] rows.
export const pieData = (rows, labelKey, label) => {
  const colors = palette(rows.length);
  return {
    labels: rows.map((row) => row[labelKey]),
    datasets: [
      {
        label,
        data: rows.map((row) => row.count),
        backgroundColor: colors.map((c) => c.background),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };
};

const PRIORITY_COLORS = {
  HIGH: "255, 99, 132",
  MEDIUM: "54, 162, 235",
  LOW: "75, 192, 192",
};

// One bar per priority that has open tasks.
export const priorityBarData = (rows) => ({
  labels: [""],
  datasets: rows
    .filter((row) => row._count.priority > 0)
    .map((row) => ({
      label: row.priority,
      data: [row._count.priority],
      backgroundColor: `rgba(${PRIORITY_COLORS[row.priority]}, 0.5)`,
      borderColor: `rgba(${PRIORITY_COLORS[row.priority]}, 1)`,
      borderWidth: 1,
    })),
});

export const chartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: window.innerWidth < 767 ? "bottom" : "left" },
  },
});
