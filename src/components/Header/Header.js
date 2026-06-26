import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <h1 className="logo">DeliveryApp</h1>
      <div className="user-info">
        <span className="user-greeting">Hi, User</span>
      </div>
    </header>
  );
}

export default Header;
