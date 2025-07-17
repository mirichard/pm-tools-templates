// src/components/ResourceHeatmap.js
import React, { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const ResourceHeatmap = ({ data }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  const resources = Array.from(new Set(data.map(d => d.resource)));
  const dates = Array.from(new Set(data.map(d => d.date))).sort();
  
  const getLoadColor = (load) => {
    if (load >= 90) return 'bg-red-500';
    if (load >= 75) return 'bg-yellow-500';
    if (load >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getLoadIntensity = (load) => {
    return Math.max(0.1, load / 100);
  };
  
  const getResourceUtilization = (resource) => {
    const resourceData = data.filter(d => d.resource === resource);
    const avgLoad = resourceData.reduce((sum, d) => sum + d.load, 0) / resourceData.length;
    return Math.round(avgLoad);
  };
  
  const getUtilizationStatus = (utilization) => {
    if (utilization >= 90) return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' };
    if (utilization >= 75) return { icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
  };
  
  const overutilizedResources = resources.filter(r => getResourceUtilization(r) >= 90).length;
  const optimalResources = resources.filter(r => {
    const util = getResourceUtilization(r);
    return util >= 75 && util < 90;
  }).length;
  const underutilizedResources = resources.filter(r => getResourceUtilization(r) < 75).length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resource Utilization</h3>
          <p className="text-sm text-gray-600">Team workload and capacity analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Overloaded ({overutilizedResources})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Optimal ({optimalResources})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available ({underutilizedResources})</span>
          </div>
        </div>
      </div>
      
      {/* Resource list with utilization */}
      <div className="space-y-4 mb-6">
        {resources.map((resource, index) => {
          const utilization = getResourceUtilization(resource);
          const status = getUtilizationStatus(utilization);
          const StatusIcon = status.icon;
          
          return (
            <div
              key={resource}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedResource === resource ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedResource(selectedResource === resource ? null : resource)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{resource}</h4>
                    <p className="text-sm text-gray-600">Current utilization</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${status.color}`}>{utilization}%</div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getLoadColor(utilization)}`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {selectedResource === resource && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Weekly Load Distribution</h5>
                  <div className="grid grid-cols-7 gap-2">
                    {dates.map((date, dateIndex) => {
                      const entry = data.find(d => d.resource === resource && d.date === date);
                      const load = entry ? entry.load : 0;
                      
                      return (
                        <div
                          key={date}
                          className="relative"
                          onMouseEnter={() => setHoveredCell({ resource, date, load })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className={`h-8 rounded ${getLoadColor(load)} transition-all duration-200`}
                            style={{ opacity: getLoadIntensity(load) }}
                          ></div>
                          <div className="text-xs text-center mt-1 text-gray-600">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xs text-center text-gray-500">{load}%</div>
                          
                          {hoveredCell && hoveredCell.resource === resource && hoveredCell.date === date && (
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {load}% on {new Date(date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary statistics */}
      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
            <p className="text-sm text-gray-600">Total Resources</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(resources.reduce((sum, r) => sum + getResourceUtilization(r), 0) / resources.length)}%
            </p>
            <p className="text-sm text-gray-600">Avg Utilization</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{underutilizedResources}</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceHeatmap;

