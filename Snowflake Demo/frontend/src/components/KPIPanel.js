// src/components/KPIPanel.js
import React from 'react';

import Tooltip from './ui/Tooltip';
import ExpandableCard from './ui/ExpandableCard';
import AccessibleIcon from './ui/AccessibleIcon';

const KPIPanel = () => {
  const metrics = [
    { key: 'SPI', value: 1.05, threshold: 0.9 },
    { key: 'CPI', value: 0.95, threshold: 1.0 },
  ];

  const getColor = (metric) =>
    metric.value >= metric.threshold ? '#4caf50' : '#f44336';

  return (
<div role="region" aria-labelledby="kpi-panel-title">
<h3 id="kpi-panel-title">KPI Panel</h3>
<div style={{ display: 'flex', gap: '16px' }}>
        {metrics.map(metric => {
          const color = getColor(metric);
          const icon = (
            <AccessibleIcon label={`${metric.key} status`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" />
              </svg>
            </AccessibleIcon>
          );
          return (
            <ExpandableCard
              key={metric.key}
              summary={
                <Tooltip content={`Current value: ${metric.value}, threshold: ${metric.threshold}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {icon}
                    <span style={{ color }}>{metric.key}: {metric.value}</span>
                  </div>
                </Tooltip>
              }
            >
              {/* Trend sparkline for {metric.key} */}
              <div style={{ height: '50px' }}>
                {/* TODO: Insert sparkline chart component here */}
                <span style={{ color }}>Trend chart placeholder</span>
              </div>
            </ExpandableCard>
          );
        })}
      </div>
  </div>
);

export default KPIPanel;

