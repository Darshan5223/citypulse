import { useEffect, useState } from "react";
import axios from "axios";

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

const CITY_POINTS = {
  Bangalore: { point: "12.9716,77.5946", peakZone: "Silk Board" },
  Mumbai:    { point: "19.0760,72.8777", peakZone: "Andheri" },
  Delhi:     { point: "28.6139,77.2090", peakZone: "Connaught Place" },
  Chennai:   { point: "13.0827,80.2707", peakZone: "Anna Nagar" },
  Hyderabad: { point: "17.3850,78.4867", peakZone: "HITEC City" },
};

const STATUS_COLORS = {
  Severe:   { bg: "#FAECE7", color: "#712B13" },
  Heavy:    { bg: "#FAEEDA", color: "#633806" },
  Moderate: { bg: "#E1F5EE", color: "#085041" },
  Free:     { bg: "#E6F1FB", color: "#0C447C" },
};

function getStatus(ratio) {
  if (ratio < 0.4) return "Severe";
  if (ratio < 0.6) return "Heavy";
  if (ratio < 0.8) return "Moderate";
  return "Free";
}

export default function StatsBar({ city }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrafficData = async () => {
    setLoading(true);
    try {
      const { point, peakZone } = CITY_POINTS[city.name];
      const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${point}&unit=KMPH&key=${TOMTOM_KEY}`;
      const res = await axios.get(url);
      const data = res.data.flowSegmentData;

      const currentSpeed = Math.round(data.currentSpeed);
      const freeFlowSpeed = Math.round(data.freeFlowSpeed);
      const ratio = data.currentSpeed / data.freeFlowSpeed;
      const congestion = Math.round((1 - ratio) * 100);
      const status = getStatus(ratio);
      const confidence = Math.round(data.confidence * 100);

      setStats({
        congestion: `${congestion}%`,
        avgSpeed: `${currentSpeed} km/h`,
        freeFlow: `${freeFlowSpeed} km/h`,
        peakZone,
        status,
        confidence: `${confidence}%`,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Traffic API error:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on city change
  useEffect(() => {
    fetchTrafficData();
  }, [city]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchTrafficData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  if (loading) {
    return (
      <div className="stats-bar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">Loading...</div>
            <div className="stat-value" style={{ color: "#444" }}>--</div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">⚠️ Error</div>
          <div className="stat-value" style={{ fontSize: "13px" }}>Could not fetch traffic data</div>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[stats.status];

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-label">🔴 Congestion Level</div>
        <div className="stat-value">{stats.congestion}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🚗 Current Speed</div>
        <div className="stat-value">{stats.avgSpeed}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🟢 Free Flow Speed</div>
        <div className="stat-value">{stats.freeFlow}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">📍 Peak Zone</div>
        <div className="stat-value" style={{ fontSize: "14px" }}>{stats.peakZone}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">📊 Traffic Status</div>
        <div
          className="stat-value stat-badge"
          style={{ background: statusStyle.bg, color: statusStyle.color }}
        >
          {stats.status}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🎯 Confidence</div>
        <div className="stat-value">{stats.confidence}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🕐 Last Updated</div>
        <div className="stat-value" style={{ fontSize: "13px" }}>{lastUpdated}</div>
      </div>
    </div>
  );
}