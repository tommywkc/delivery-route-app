import React from 'react';
import vanGif from '../../assets/van.gif';
import './LoadingVan.css';

function LoadingVan() {
  return (
    <div className="loading-container" aria-label="Loading route">
      <div className="loading-group">
        <div className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <img src={vanGif} alt="Loading van" className="van-image" />
      </div>
    </div>
  );
}

export default LoadingVan;