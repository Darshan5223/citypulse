import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import IncidentMarkers from "./IncidentMarkers";

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

function MapUpdater({ city, searchLocation }) {
  const map = useMap();

  useEffect(() => {
    map.setView([city.lat, city.lng], city.zoom, { animate: true });
  }, [city]);

  useEffect(() => {
    if (searchLocation) {
      map.setView([searchLocation.lat, searchLocation.lng], 15, { animate: true });
    }
  }, [searchLocation]);

  return null;
}

export default function TrafficMap({ city, mapLayer, searchLocation }) {
  return (
    <MapContainer
      center={[city.lat, city.lng]}
      zoom={city.zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      {/* Base map layer from TomTom */}
      <TileLayer
        url={`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
        attribution="© TomTom"
        maxZoom={22}
      />

      {/* Traffic flow layer */}
      {mapLayer === "traffic" && (
        <TileLayer
          url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
          opacity={0.8}
          maxZoom={22}
        />
      )}

      {/* Traffic incidents layer */}
      {mapLayer === "incidents" && (
        <TileLayer
          url={`https://api.tomtom.com/traffic/map/4/tile/incidents/s3/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
          opacity={0.9}
          maxZoom={22}
        />
      )}
      {/* Incident markers */}
      <IncidentMarkers city={city} />
      {/* Handles city switching + search jumping */}
      <MapUpdater city={city} searchLocation={searchLocation} />
    </MapContainer>
  );
}