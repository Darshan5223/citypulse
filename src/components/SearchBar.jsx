import { useState, useEffect, useRef } from "react";
import axios from "axios";

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export default function SearchBar({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const searchLocation = async (value) => {
    if (value.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(value)}.json`,
        {
          params: {
            key: TOMTOM_KEY,
            limit: 5,
            countrySet: "IN",
          },
        }
      );
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Wait 600ms after user stops typing before calling API
    debounceTimer.current = setTimeout(() => {
      searchLocation(value);
    }, 600);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleSelect = (result) => {
    const { lat, lon } = result.position;
    onLocationSelect({ lat, lng: lon, name: result.address.freeformAddress });
    setQuery(result.address.freeformAddress);
    setResults([]);
  };

  return (
    <div className="search-wrapper">
      <div className="search-input-row">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search any location in India..."
          value={query}
          onChange={handleChange}
        />
        {loading && <span className="search-spinner">⏳</span>}
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(""); setResults([]); }}
          >✕</button>
        )}
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((r, i) => (
            <div
              key={i}
              className="search-result-item"
              onClick={() => handleSelect(r)}
            >
              <span className="result-icon">📍</span>
              <div>
                <div className="result-name">{r.poi?.name || r.address.freeformAddress}</div>
                <div className="result-address">{r.address.freeformAddress}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}