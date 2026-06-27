import React, { useState, useEffect, useRef } from 'react';
import './FloatingInput.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function FloatingInput({ id, value, onChange, onClear, shortLabel, longLabel, style, showClearBtn }) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        // Use Mapbox Geocoding API limits to places and POIs, and restricted to Hong Kong (country=hk)
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=hk`
        );
        const data = await response.json();
        if (data.features) {
          setSuggestions(data.features);
        }
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  function handleSuggestionClick(suggestion) {
    const syntheticEvent = {
      target: { value: suggestion.place_name },
    };
    onChange(syntheticEvent);
    setShowSuggestions(false);
  }

  function handleInputFocus() {
    setIsFocused(true);
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }

  function handleInputChange(e) {
    onChange(e);
    setShowSuggestions(true);
  }

  return (
    <div className="floating-label-group" style={style} ref={wrapperRef}>
      <input
        id={id}
        name={id}
        type="text"
        className="floating-input"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        autoComplete="off"
      />
      <label htmlFor={id} className="floating-label">
        {value || isFocused ? shortLabel : longLabel}
      </label>
      {showClearBtn && (
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={`Action on ${shortLabel}`}
        >
          &#x2715;
        </button>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.id} 
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <strong>{suggestion.text}</strong>
              <span className="suggestion-subtext">
                {suggestion.place_name.substring(suggestion.text.length + 1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FloatingInput;
