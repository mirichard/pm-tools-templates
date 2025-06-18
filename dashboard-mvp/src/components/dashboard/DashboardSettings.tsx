'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Layout, Bell, Download, Save, RotateCcw } from 'lucide-react';

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: DashboardSettings) => void;
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  refreshInterval: number; // in seconds
  defaultView: 'overview' | 'detailed' | 'compact';
  notifications: {
    riskAlerts: boolean;
    milestoneUpdates: boolean;
    teamUpdates: boolean;
    systemAlerts: boolean;
  };
  widgets: {
    metrics: boolean;
    progressChart: boolean;
    riskHeatmap: boolean;
    teamPerformance: boolean;
    qualityMetrics: boolean;
    projectTimeline: boolean;
  };
  layout: {
    gridColumns: 1 | 2 | 3;
    widgetSpacing: 'compact' | 'normal' | 'relaxed';
  };
  export: {
    defaultFormat: 'pdf' | 'csv' | 'json';
    includeCharts: boolean;
    includeData: boolean;
  };
}

const DEFAULT_SETTINGS: DashboardSettings = {
  theme: 'light',
  refreshInterval: 30,
  defaultView: 'overview',
  notifications: {
    riskAlerts: true,
    milestoneUpdates: true,
    teamUpdates: false,
    systemAlerts: true,
  },
  widgets: {
    metrics: true,
    progressChart: true,
    riskHeatmap: true,
    teamPerformance: true,
    qualityMetrics: true,
    projectTimeline: true,
  },
  layout: {
    gridColumns: 2,
    widgetSpacing: 'normal',
  },
  export: {
    defaultFormat: 'pdf',
    includeCharts: true,
    includeData: true,
  },
};

export function DashboardSettings({ isOpen, onClose, onSettingsChange }: DashboardSettingsProps) {
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'general' | 'layout' | 'notifications' | 'export'>('general');

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.warn('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    onSettingsChange(settings);
    onClose();
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('dashboardSettings');
  };

  const updateSettings = (updates: Partial<DashboardSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateNestedSettings = <K extends keyof DashboardSettings>(
    key: K,
    updates: Partial<DashboardSettings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...(prev[key] as object), ...updates }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Dashboard Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(80vh-140px)]">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r">
            <nav className="p-4 space-y-2">
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'layout', label: 'Layout', icon: Layout },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'export', label: 'Export', icon: Download },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">General Settings</h3>
                
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSettings({ theme: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                {/* Refresh Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-refresh interval (seconds)
                  </label>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                    <option value={0}>Manual only</option>
                  </select>
                </div>

                {/* Default View */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default view
                  </label>
                  <select
                    value={settings.defaultView}
                    onChange={(e) => updateSettings({ defaultView: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="overview">Overview</option>
                    <option value="detailed">Detailed</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Layout Settings</h3>
                
                {/* Grid Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid columns
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(cols => (
                      <button
                        key={cols}
                        onClick={() => updateNestedSettings('layout', { gridColumns: cols as any })}
                        className={`px-4 py-2 rounded-md border ${
                          settings.layout.gridColumns === cols
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {cols} Column{cols > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Widget Spacing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget spacing
                  </label>
                  <div className="flex gap-2">
                    {['compact', 'normal', 'relaxed'].map(spacing => (
                      <button
                        key={spacing}
                        onClick={() => updateNestedSettings('layout', { widgetSpacing: spacing as any })}
                        className={`px-4 py-2 rounded-md border capitalize ${
                          settings.layout.widgetSpacing === spacing
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {spacing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Widget Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visible widgets
                  </label>
                  <div className="space-y-3">
                    {Object.entries(settings.widgets).map(([key, enabled]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => updateNestedSettings('widgets', { [key]: e.target.checked } as any)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, enabled]) => (
                    <label key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <p className="text-sm text-gray-500">
                          {key === 'riskAlerts' && 'Get notified when risks change status'}
                          {key === 'milestoneUpdates' && 'Get notified about milestone progress'}
                          {key === 'teamUpdates' && 'Get notified about team member updates'}
                          {key === 'systemAlerts' && 'Get notified about system issues'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateNestedSettings('notifications', { [key]: e.target.checked } as any)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Export Settings</h3>
                
                {/* Default Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default export format
                  </label>
                  <select
                    value={settings.export.defaultFormat}
                    onChange={(e) => updateNestedSettings('export', { defaultFormat: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF Report</option>
                    <option value="csv">CSV Data</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>

                {/* Export Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.export.includeCharts}
                      onChange={(e) => updateNestedSettings('export', { includeCharts: e.target.checked })}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Include charts and visualizations</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.export.includeData}
                      onChange={(e) => updateNestedSettings('export', { includeData: e.target.checked })}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Include raw data tables</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handleResetSettings}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

