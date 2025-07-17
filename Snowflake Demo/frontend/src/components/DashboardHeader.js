// src/components/DashboardHeader.js
import React, { useState } from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ onExportClick, onSettingsClick, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onRefresh) onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-main">
          {/* Logo and Title */}
          <div className="header-brand">
            <div className="brand-logo">
              <div className="logo-icon">❄️</div>
              <div className="brand-text">
                <h1>Snowflake PMO</h1>
                <span className="subtitle">Project Management Dashboard</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            {tabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-tab ${activeTab === id ? 'active' : ''}`}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Search */}
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                className="search-input"
                aria-label="Search projects"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className={`action-btn ${isRefreshing ? 'spinning' : ''}`}
              title="Refresh dashboard data"
              aria-label="Refresh dashboard data"
            >
              <span className="action-icon">🔄</span>
            </button>

            {/* Export */}
            <button
              onClick={onExportClick}
              className="action-btn"
              title="Export dashboard"
              aria-label="Export dashboard"
            >
              <span className="action-icon">📥</span>
            </button>

            {/* Notifications */}
            <button className="action-btn notification-btn" title="Notifications">
              <span className="action-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>

            {/* Settings */}
            <button
              onClick={onSettingsClick}
              className="action-btn"
              title="Dashboard settings"
              aria-label="Dashboard settings"
            >
              <span className="action-icon">⚙️</span>
            </button>

            {/* Project Selector */}
            <select className="project-selector" aria-label="Select project">
              <option value="snowflake-pmo">Snowflake PMO</option>
              <option value="dashboard-mvp">Dashboard MVP</option>
              <option value="workflow-lib">Workflow Library</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-left">
            <span className="status-indicator">
              <div className="status-dot online"></div>
              <span>System Status: Operational</span>
            </span>
            <span className="status-item">
              Last Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="status-right">
            <span className="status-item">Data Range: Last 30 days</span>
            <button className="status-link">Customize</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
