// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import GanttChart from '../components/GanttChart';
import RiskMatrix from '../components/RiskMatrix';
import KPIPanel from '../components/KPIPanel';
import MilestoneTable from '../components/MilestoneTable';
import PortfolioSummary from '../components/PortfolioSummary';
import ResourceHeatmap from '../components/ResourceHeatmap';
import UpcomingTasks from '../components/UpcomingTasks';
import { projectsData, milestonesData, tasksData, risksData, resourceLoadData } from '../data/mockData';

const Dashboard = () => {
  // Track filter state and reset banner
  const defaultFilters = { pms: [], status: [] };
  const [filters, setFilters] = useState(defaultFilters);
  const [showResetBanner, setShowResetBanner] = useState(false);

  // Hide banner after timeout
  useEffect(() => {
    if (showResetBanner) {
      const timer = setTimeout(() => setShowResetBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showResetBanner]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters(defaultFilters);
    setShowResetBanner(true);
  };

  return (
  <div style={{ padding: '16px' }}>
{showResetBanner && (
          <div role="status" aria-live="polite" style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#e0f7fa', borderRadius: '4px' }}>
            Filters have been reset to default
          </div>
        )}
        <FilterPanel
          onFilterChange={handleFilterChange}
          onFilterReset={handleFilterReset}
          showResetState={filters.pms.length === 0 && filters.status.length === 0}
        />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{ gridColumn: '1 / span 2' }}>
<KPIPanel />
        {/* Portfolio summary across projects */}
        <div style={{ gridColumn: '1 / span 2' }}>
          <PortfolioSummary data={projectsData} />
        </div>
      </div>
      <GanttChart data={projectsData} />
      <RiskMatrix data={risksData} />
      <MilestoneTable data={milestonesData} />
      <ResourceHeatmap data={resourceLoadData} />
      <UpcomingTasks data={tasksData} />
    </div>
  </div>
  );
};

export default Dashboard;

