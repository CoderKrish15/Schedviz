import React, { useState, useRef, useEffect } from 'react';

export default function Tooltip({ children, content, visible, x, y }) {
  if (!visible || !content) return null;

  return (
    <div
      className="tooltip"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -110%)',
        zIndex: 9999,
      }}
    >
      {content}
    </div>
  );
}
