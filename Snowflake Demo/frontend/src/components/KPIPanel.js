// src/components/KPIPanel.js
import React from 'react';

const KPIPanel = () => (
  <div>
    <h3>KPI Panel</h3>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h4>SPI</h4>
        <p>1.05</p>
      </div>
      <div>
        <h4>CPI</h4>
        <p>0.95</p>
      </div>
    </div>
  </div>
);

export default KPIPanel;

