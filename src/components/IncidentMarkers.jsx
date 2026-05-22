import { useEffect, useState } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

// Custom colored icons based on severity
function createIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

const SEVERITY_CONFIG = {
  1: { color: "#4a9eff", label: "Minor" },
  2: { color: "#f0a500", label: "Moderate" },
  3: { color: "#e06000", label: "Major" },
  4: { color: "#dc3030", label: "Critical" },
};

const INCIDENT_ICONS = {
  0: "🚧", 1: "🚗", 2: "🌧️", 3: "⛽", 4: "🚨",
  5: "🚦", 6: "⚠️", 7: "🚧", 8: "🔧", 9: "🚗",
  10: "⛰️", 11: "🌫️", 14: "🚌",
};

export default function IncidentMarkers({ city }) {
  const [incidents, setIncidents] = useState([]);
  const map = useMap();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Build bounding box around city center
        const { lat, lng } = city;
        const delta = 0.08;
        const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;

        const res = await axios.get(
          `https://api.tomtom.com/traffic/services/5/incidentDetails`,
          {
            params: {
              key: TOMTOM_KEY,
              bbox,
              fields: "{incidents{type,geometry{coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}",
              language: "en-GB",
              categoryFilter: "0,1,2,3,4,5,6,7,8,9,10,11,14",
              timeValidityFilter: "present",
            },
          }
        );

        const data = res.data.incidents || [];
const filtered = data.filter(inc =>
  (inc.properties?.magnitudeOfDelay || 1) >= 2
);
setIncidents(filtered);
      } catch (err) {
        console.error("Incidents fetch error:", err);
      }
    };

    fetchIncidents();
  }, [city]);

  return (
    <>
      {incidents.map((incident, i) => {
        const coords = incident.geometry?.coordinates;
        if (!coords) return null;

        // Handle both Point and LineString geometries
        const position =
          incident.geometry.type === "Point"
            ? [coords[1], coords[0]]
            : [coords[0][1], coords[0][0]];

        const props = incident.properties || {};
        const severity = props.magnitudeOfDelay || 1;
        const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG[1];
        const icon = createIcon(config.color);
        const category = props.iconCategory || 0;
        const emoji = INCIDENT_ICONS[category] || "⚠️";
        const description = props.events?.[0]?.description || "Traffic incident";
        const from = props.from || "";
        const to = props.to || "";
        const delay = props.delay ? `${Math.round(props.delay / 60)} min delay` : "";

        return (
          <Marker key={props.id || i} position={position} icon={icon}>
            <Popup>
              <div style={{
                fontFamily: "-apple-system, sans-serif",
                minWidth: "180px",
                padding: "4px",
              }}>
                <div style={{ fontSize: "16px", marginBottom: "6px" }}>
                  {emoji} <strong>{description}</strong>
                </div>
                <div style={{
                  display: "inline-block",
                  background: config.color,
                  color: "#fff",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  marginBottom: "8px",
                }}>
                  {config.label} severity
                </div>
                {from && (
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "3px" }}>
                    📍 From: {from}
                  </div>
                )}
                {to && (
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "3px" }}>
                    🏁 To: {to}
                  </div>
                )}
                {delay && (
                  <div style={{ fontSize: "12px", color: "#e06000", fontWeight: "500" }}>
                    ⏱ {delay}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}