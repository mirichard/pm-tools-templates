'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap';
import { TeamPerformance } from '@/components/dashboard/team-performance';
import { QualityMetrics } from '@/components/dashboard/quality-metrics';
import { ProjectTimeline } from '@/components/dashboard/project-timeline';
import { DashboardSettings, type DashboardSettings as DashboardSettingsType } from '@/components/dashboard/DashboardSettings';
import { ExportDialog } from '@/components/dashboard/ExportDialog';
import { ToastProvider } from '@/components/ui/toast';
import { useDashboardData } from '@/lib/api';
import { TrendingUp, Users, AlertTriangle, Target, Clock, Loader } from 'lucide-react';

export default function Dashboard() {
  const { data, loading, error } = useDashboardData();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettingsType | null>(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        setDashboardSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.warn('Failed to parse dashboard settings:', error);
      }
    }
  }, []);

  const handleSettingsChange = (settings: DashboardSettingsType) => {
    setDashboardSettings(settings);
  };

  const handleExportClick = () => {
    setExportOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on settings
  const gridCols = dashboardSettings?.layout.gridColumns || 2;
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
  }[gridCols];

  const spacing = dashboardSettings?.layout.widgetSpacing || 'normal';
  const spacingClass = {
    compact: 'gap-4',
    normal: 'gap-6',
    relaxed: 'gap-8'
  }[spacing];

  const widgets = dashboardSettings?.widgets || {
    metrics: true,
    progressChart: true,
    riskHeatmap: true,
    teamPerformance: true,
    qualityMetrics: true,
    projectTimeline: true
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          onExportClick={handleExportClick}
          onSettingsClick={handleSettingsClick}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Overview */}
        {widgets.metrics && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ${spacingClass} mb-8`}>
            <MetricCard
              title="Schedule Performance"
              value={`${data?.metrics.schedulePerformance}%`}
              trend={5.2}
              trendDirection="up"
              icon={Clock}
              color="blue"
              onClick={() => console.log('Schedule performance clicked')}
              description="Percentage of milestones completed on time"
            />
            <MetricCard
              title="Budget Variance"
              value={`${data?.metrics.budgetVariance}%`}
              trend={3.1}
              trendDirection="down"
              icon={Target}
              color="red"
            />
            <MetricCard
              title="Quality Score"
              value={`${data?.metrics.qualityScore}%`}
              trend={2.8}
              trendDirection="up"
              icon={Target}
              color="green"
            />
            <MetricCard
              title="Team Velocity"
              value={`${data?.metrics.teamVelocity}`}
              trend={8.5}
              trendDirection="up"
              icon={TrendingUp}
              color="purple"
            />
            <MetricCard
              title="Risk Level"
              value={data?.metrics.riskLevel || 'Medium'}
              trend={-1.2}
              trendDirection="down"
              icon={AlertTriangle}
              color="yellow"
            />
            <MetricCard
              title="Stakeholder Satisfaction"
              value={`${data?.metrics.stakeholderSatisfaction}%`}
              trend={4.7}
              trendDirection="up"
              icon={Users}
              color="indigo"
            />
          </div>
        )}

        {/* Charts and Analytics */}
        <div className={`grid ${gridClass} ${spacingClass} mb-8`}>
          {widgets.progressChart && <ProgressChart data={data?.progressData} />}
          {widgets.riskHeatmap && <RiskHeatmap risks={data?.risks} />}
        </div>

        {/* Detailed Analytics */}
        <div className={`grid ${gridClass} ${spacingClass} mb-8`}>
          {widgets.teamPerformance && <TeamPerformance teamMembers={data?.teamMembers} />}
          {widgets.qualityMetrics && <QualityMetrics metrics={data?.qualityMetrics} />}
        </div>

        {/* Action Items and Timeline */}
        {widgets.projectTimeline && (
          <div className={`grid grid-cols-1 ${spacingClass}`}>
            <ProjectTimeline timeline={data?.timeline} />
          </div>
        )}
      </main>

      {/* Settings Dialog */}
      <DashboardSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsChange={handleSettingsChange}
      />

        {/* Export Dialog */}
        <ExportDialog
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
