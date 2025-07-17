// src/components/ui/Tooltip.js
import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ content, children, placement = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const idRef = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  // Optionally hide on reduced motion preference
  const [shouldReduceMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  return (
    <span
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={idRef.current}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && (
        <div
          id={idRef.current}
          role="tooltip"
          style={{
            position: 'absolute',
            [placement]: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#333',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            transition: shouldReduceMotion ? 'none' : 'opacity 150ms ease-in-out',
            opacity: visible ? 1 : 0,
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
