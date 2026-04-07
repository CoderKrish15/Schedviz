import React from 'react';

export default function Header() {
  return (
    <header id="header" className="header">
      <div className="header-content">
        <div className="header-logo-group">
          <h1 className="header-title">
            <span className="header-bracket">[</span>
            SCHEDVIZ
            <span className="header-bracket">]</span>
          </h1>
          <span className="header-version">v1.0</span>
        </div>
        <p className="header-subtitle">
          CPU Scheduling Algorithm Visualizer
          <span className="blink-cursor">_</span>
        </p>
      </div>
      <div className="header-status">
        <span className="status-dot"></span>
        <span className="status-text">SYSTEM READY</span>
      </div>
    </header>
  );
}
