import React, { useState } from 'react';
import './FloatingInput.css';

function FloatingInput({ id, value, onChange, onClear, shortLabel, longLabel, style }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="floating-label-group" style={style}>
      <input
        id={id}
        name={id}
        type="text"
        className="floating-input"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
      />
      <label htmlFor={id} className="floating-label">
        {value || isFocused ? shortLabel : longLabel}
      </label>
      {value && (
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={`Clear ${shortLabel}`}
        >
          &#x2715;
        </button>
      )}
    </div>
  );
}

export default FloatingInput;
