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
    <div className="min-h-screen bg-gray-100 p-6">
      {showResetBanner && (
        <div role="status" aria-live="polite" className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-800">
          Filters have been reset to default
        </div>
      )}
      
      <div className="mb-6">
        <FilterPanel
          onFilterChange={handleFilterChange}
          onFilterReset={handleFilterReset}
          showResetState={filters.pms.length === 0 && filters.status.length === 0}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Panel - Full width */}
        <div className="lg:col-span-2">
          <KPIPanel />
        </div>
        
        {/* Portfolio Summary - Full width */}
        <div className="lg:col-span-2">
          <PortfolioSummary data={projectsData} />
        </div>
        
        {/* Project Timeline - Full width */}
        <div className="lg:col-span-2">
          <GanttChart data={projectsData} />
        </div>
        
        {/* Risk Matrix */}
        <div>
          <RiskMatrix data={risksData} />
        </div>
        
        {/* Resource Heatmap */}
        <div>
          <ResourceHeatmap data={resourceLoadData} />
        </div>
        
        {/* Milestone Table - Full width */}
        <div className="lg:col-span-2">
          <MilestoneTable data={milestonesData} />
        </div>
        
        {/* Upcoming Tasks - Full width */}
        <div className="lg:col-span-2">
          <UpcomingTasks data={tasksData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

