import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CITY_HOURLY_DATA = {
  Bangalore: [15, 20, 18, 22, 45, 72, 85, 78, 55, 48, 52, 58, 65, 60, 55, 62, 80, 88, 75, 60, 45, 35, 25, 18],
  Mumbai:    [18, 22, 20, 25, 50, 78, 90, 85, 65, 55, 58, 62, 70, 65, 60, 68, 85, 92, 80, 65, 50, 38, 28, 20],
  Delhi:     [12, 18, 15, 20, 42, 68, 82, 75, 52, 45, 48, 55, 62, 58, 52, 60, 78, 85, 72, 58, 42, 32, 22, 15],
  Chennai:   [10, 15, 12, 18, 38, 62, 75, 70, 48, 42, 45, 50, 58, 52, 48, 55, 72, 80, 68, 52, 38, 28, 20, 12],
  Hyderabad: [12, 16, 14, 19, 40, 65, 78, 72, 50, 44, 47, 52, 60, 55, 50, 57, 75, 82, 70, 55, 40, 30, 21, 14],
};

const HOURS = [
  "12a","1a","2a","3a","4a","5a","6a","7a","8a","9a",
  "10a","11a","12p","1p","2p","3p","4p","5p","6p","7p",
  "8p","9p","10p","11p"
];

function getBarColor(value) {
  if (value >= 75) return "rgba(220, 80, 60, 0.85)";
  if (value >= 50) return "rgba(230, 160, 40, 0.85)";
  if (value >= 30) return "rgba(250, 200, 60, 0.85)";
  return "rgba(60, 180, 120, 0.85)";
}

export default function CongestionChart({ city }) {
  const data = CITY_HOURLY_DATA[city.name];
  const currentHour = new Date().getHours();

  const chartData = {
    labels: HOURS,
    datasets: [
      {
        label: "Congestion %",
        data: data,
        backgroundColor: data.map((v, i) =>
          i === currentHour ? "rgba(74, 158, 255, 0.95)" : getBarColor(v)
        ),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: `${city.name}  ·  24-hour Congestion Pattern  ·  Blue = current hour`,
      color: "rgba(255,255,255,0.3)",
      font: { size: 11, weight: "400" },
      padding: { bottom: 12 },
    },
    tooltip: {
      backgroundColor: "rgba(13,17,23,0.95)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "rgba(255,255,255,0.5)",
      bodyColor: "#fff",
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ` Congestion: ${ctx.raw}%`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "rgba(255,255,255,0.25)",
        font: { size: 10 },
      },
      grid: { color: "rgba(255,255,255,0.04)" },
      border: { color: "rgba(255,255,255,0.06)" },
    },
    y: {
      min: 0,
      max: 100,
      ticks: {
        color: "rgba(255,255,255,0.25)",
        font: { size: 10 },
        callback: (val) => `${val}%`,
      },
      grid: { color: "rgba(255,255,255,0.04)" },
      border: { color: "rgba(255,255,255,0.06)" },
    },
  },
};

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <span>📈 Peak Hour Congestion</span>
        <div className="chart-legend">
          <span className="legend-dot" style={{ background: "rgba(60,180,120,0.85)" }}></span> Free
          <span className="legend-dot" style={{ background: "rgba(250,200,60,0.85)" }}></span> Moderate
          <span className="legend-dot" style={{ background: "rgba(230,160,40,0.85)" }}></span> Heavy
          <span className="legend-dot" style={{ background: "rgba(220,80,60,0.85)" }}></span> Severe
          <span className="legend-dot" style={{ background: "rgba(74,158,255,0.95)" }}></span> Now
        </div>
      </div>
      <div style={{ height: "160px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}