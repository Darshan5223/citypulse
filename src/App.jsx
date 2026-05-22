import { useState } from "react";
import TrafficMap from "./components/TrafficMap";
import StatsBar from "./components/StatsBar";
import CongestionChart from "./components/CongestionChart";
import SearchBar from "./components/SearchBar";
import "./App.css";

const CITIES = [
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, zoom: 12 },
  { name: "Delhi", lat: 28.6139, lng: 77.209, zoom: 12 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, zoom: 12 },
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [mapLayer, setMapLayer] = useState("traffic");
  const [searchLocation, setSearchLocation] = useState(null);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">🏙️ CityPulse</div>
          <div className="tagline">Live Urban Traffic Dashboard</div>
        </div>
        <div className="header-controls">
          {/* City Selector */}
          <select
            className="city-select"
            value={selectedCity.name}
            onChange={(e) =>
              setSelectedCity(CITIES.find((c) => c.name === e.target.value))
            }
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                📍 {c.name}
              </option>
            ))}
          </select>

          {/* Layer Toggle */}
          <div className="layer-toggle">
            <button
              className={mapLayer === "traffic" ? "active" : ""}
              onClick={() => setMapLayer("traffic")}
            >
              🚦 Traffic
            </button>
            <button
              className={mapLayer === "incidents" ? "active" : ""}
              onClick={() => setMapLayer("incidents")}
            >
              ⚠️ Incidents
            </button>
          </div>
        </div>
        <SearchBar onLocationSelect={setSearchLocation} />
      </header>

      {/* Stats Bar */}
      <StatsBar city={selectedCity} />

      {/* Map */}
      <CongestionChart city={selectedCity} />
      <div className="map-wrapper">
<TrafficMap city={selectedCity} mapLayer={mapLayer} searchLocation={searchLocation} />      </div>

      {/* Footer */}
      <footer className="footer">
        Data powered by TomTom Traffic API · CityPulse · BITS ZC229T Design Project
      </footer>
    </div>
  );
}