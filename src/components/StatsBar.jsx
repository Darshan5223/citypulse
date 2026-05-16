const CITY_STATS = {
  Bangalore: { congestion: "72%", avgSpeed: "18 km/h", peakZone: "Silk Board", incidents: 14, status: "Heavy" },
  Mumbai:    { congestion: "81%", avgSpeed: "14 km/h", peakZone: "Andheri",    incidents: 22, status: "Severe" },
  Delhi:     { congestion: "68%", avgSpeed: "21 km/h", peakZone: "Connaught Place", incidents: 18, status: "Heavy" },
  Chennai:   { congestion: "55%", avgSpeed: "27 km/h", peakZone: "Anna Nagar", incidents: 9,  status: "Moderate" },
  Hyderabad: { congestion: "61%", avgSpeed: "24 km/h", peakZone: "HITEC City", incidents: 11, status: "Moderate" },
};

const STATUS_COLORS = {
  Severe:   { bg: "#FAECE7", color: "#712B13" },
  Heavy:    { bg: "#FAEEDA", color: "#633806" },
  Moderate: { bg: "#E1F5EE", color: "#085041" },
};

export default function StatsBar({ city }) {
  const stats = CITY_STATS[city.name];
  const statusStyle = STATUS_COLORS[stats.status];

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-label">🔴 Congestion Level</div>
        <div className="stat-value">{stats.congestion}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">🚗 Avg Speed</div>
        <div className="stat-value">{stats.avgSpeed}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">📍 Peak Zone</div>
        <div className="stat-value">{stats.peakZone}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">⚠️ Active Incidents</div>
        <div className="stat-value">{stats.incidents}</div>
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
    </div>
  );
}