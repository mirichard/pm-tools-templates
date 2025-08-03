// src/components/KPIPanel.js
import React, { useState } from 'react';
import './KPIPanel.css';

const KPIPanel = () => {
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  const metrics = [
    { 
      key: 'SPI', 
      name: 'Schedule Performance Index',
      value: 1.05, 
      threshold: 0.9,
      trend: 'up',
      trendValue: 3.2,
      description: 'Measures how efficiently the project team is using its time',
      icon: '📅',
      color: 'blue'
    },
    { 
      key: 'CPI', 
      name: 'Cost Performance Index',
      value: 0.95, 
      threshold: 1.0,
      trend: 'down',
      trendValue: -2.1,
      description: 'Measures the cost efficiency of budgeted resources',
      icon: '💰',
      color: 'green'
    },
    { 
      key: 'SV', 
      name: 'Schedule Variance',
      value: 0.12, 
      threshold: 0.0,
      trend: 'up',
      trendValue: 1.8,
      description: 'Difference between planned and actual schedule progress',
      icon: '⏱️',
      color: 'purple'
    },
    { 
      key: 'CV', 
      name: 'Cost Variance',
      value: -0.08, 
      threshold: 0.0,
      trend: 'down',
      trendValue: -1.2,
      description: 'Difference between planned and actual cost performance',
      icon: '💸',
      color: 'red'
    },
  ];

  const getHealthStatus = (metric) => {
    if (metric.key === 'SPI' || metric.key === 'CPI') {
      return metric.value >= metric.threshold ? 'healthy' : 'warning';
    }
    // For variance metrics, closer to 0 is better
    return Math.abs(metric.value) <= 0.05 ? 'healthy' : 'warning';
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatValue = (value) => {
    if (value >= 0) {
      return value.toFixed(2);
    }
    return value.toFixed(2);
  };

  const toggleExpanded = (metricKey) => {
    setExpandedMetric(expandedMetric === metricKey ? null : metricKey);
  };

  return (
    <div className="kpi-panel" role="region" aria-labelledby="kpi-panel-title">
      <div className="kpi-panel-header">
        <h3 id="kpi-panel-title" className="kpi-panel-title">
          📊 Performance Metrics
        </h3>
        <div className="kpi-panel-summary">
          <span className="summary-item">
            <div className="summary-dot healthy"></div>
            {metrics.filter(m => getHealthStatus(m) === 'healthy').length} Healthy
          </span>
          <span className="summary-item">
            <div className="summary-dot warning"></div>
            {metrics.filter(m => getHealthStatus(m) === 'warning').length} Warning
          </span>
        </div>
      </div>

      <div className="kpi-grid">
        {metrics.map(metric => {
          const healthStatus = getHealthStatus(metric);
          const healthColor = getHealthColor(healthStatus);
          const isExpanded = expandedMetric === metric.key;
          const isHovered = hoveredMetric === metric.key;

          return (
            <div
              key={metric.key}
              className={`kpi-card ${healthStatus} ${isExpanded ? 'expanded' : ''} ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredMetric(metric.key)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="kpi-card-header" onClick={() => toggleExpanded(metric.key)}>
                <div className="kpi-icon">{metric.icon}</div>
                <div className="kpi-main">
                  <div className="kpi-name">{metric.key}</div>
                  <div className="kpi-value" style={{ color: healthColor }}>
                    {formatValue(metric.value)}
                  </div>
                </div>
                <div className="kpi-trend">
                  <span className={`trend-icon ${metric.trend}`}>
                    {metric.trend === 'up' ? '↗️' : '↘️'}
                  </span>
                  <span className="trend-value">
                    {metric.trend === 'up' ? '+' : ''}{metric.trendValue.toFixed(1)}%
                  </span>
                </div>
                <div className="kpi-status">
                  <div className={`status-indicator ${healthStatus}`}></div>
                </div>
              </div>

              {isExpanded && (
                <div className="kpi-card-details">
                  <div className="detail-section">
                    <h4 className="detail-title">{metric.name}</h4>
                    <p className="detail-description">{metric.description}</p>
                  </div>
                  
                  <div className="detail-section">
                    <div className="detail-row">
                      <span className="detail-label">Current Value:</span>
                      <span className="detail-value">{formatValue(metric.value)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Threshold:</span>
                      <span className="detail-value">{formatValue(metric.threshold)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Trend:</span>
                      <span className={`detail-value trend-${metric.trend}`}>
                        {metric.trend === 'up' ? '↗️ Improving' : '↘️ Declining'} 
                        ({metric.trendValue > 0 ? '+' : ''}{metric.trendValue.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <div className="mini-chart">
                      <div className="chart-header">7-Day Trend</div>
                      <div className="chart-placeholder">
                        <div className="chart-bar" style={{ height: '40%' }}></div>
                        <div className="chart-bar" style={{ height: '60%' }}></div>
                        <div className="chart-bar" style={{ height: '45%' }}></div>
                        <div className="chart-bar" style={{ height: '70%' }}></div>
                        <div className="chart-bar" style={{ height: '85%' }}></div>
                        <div className="chart-bar" style={{ height: '75%' }}></div>
                        <div className="chart-bar" style={{ height: '90%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-actions">
                    <button className="detail-btn primary">View Details</button>
                    <button className="detail-btn secondary">Export Data</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPIPanel;

