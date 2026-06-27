import React from 'react';
import './Header.css';

function Header({ showBackBtn, onBack }) {
  return (
    <header className="app-header">
      <div className="header-left">
        {showBackBtn && (
          <button className="mobile-only-back-btn" onClick={onBack} aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
        <h1 className="logo desktop-only">DeliveryApp</h1>
      </div>
      <h1 className="logo mobile-center-title">DeliveryApp</h1>
      <div className="user-info">
        <span className="user-greeting desktop-only">Hi, User</span>
      </div>
    </header>
  );
}

export default Header;
