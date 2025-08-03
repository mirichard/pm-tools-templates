// src/components/ui/ExpandableCard.js
import React, { useState } from 'react';

const ExpandableCard = ({ summary, children, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = id || `expandable-${Math.random().toString(36).substr(2, 9)}`;

  const toggle = () => setIsOpen(open => !open);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', marginBottom: '8px' }}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '0',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: 'inherit'
        }}
      >
        {summary}
        <span style={{ marginLeft: 'auto' }}>
          {isOpen ? '▾' : '▸'}
        </span>
      </button>
      {isOpen && (
        <div id={panelId} style={{ marginTop: '8px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;

