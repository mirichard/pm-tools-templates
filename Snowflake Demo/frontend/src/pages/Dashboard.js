// src/pages/Dashboard.js
import React from 'react';
import FilterPanel from '../components/FilterPanel';
import GanttChart from '../components/GanttChart';
import RiskMatrix from '../components/RiskMatrix';
import KPIPanel from '../components/KPIPanel';
import MilestoneTable from '../components/MilestoneTable';
import ResourceHeatmap from '../components/ResourceHeatmap';
import UpcomingTasks from '../components/UpcomingTasks';
import { projectsData, milestonesData, tasksData, risksData, resourceLoadData } from '../data/mockData';

const Dashboard = () => (
  <div style={{ padding: '16px' }}>
    <FilterPanel onFilterChange={() => {}} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{ gridColumn: '1 / span 2' }}>
        <KPIPanel />
      </div>
      <GanttChart data={projectsData} />
      <RiskMatrix data={risksData} />
      <MilestoneTable data={milestonesData} />
      <ResourceHeatmap data={resourceLoadData} />
      <UpcomingTasks data={tasksData} />
    </div>
  </div>
);

export default Dashboard;

