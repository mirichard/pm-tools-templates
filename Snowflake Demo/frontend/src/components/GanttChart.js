// src/components/GanttChart.js
import React, { useState } from 'react';
import { Calendar, Clock, User, Target } from 'lucide-react';

const GanttChart = ({ data }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'on-hold': return '#f59e0b';
      case 'delayed': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    switch (status?.toLowerCase()) {
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'on-hold': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'delayed': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const calculateProgress = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date();
    
    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = currentDate - startDate;
    return Math.round((elapsed / total) * 100);
  };
  
  const onGoingProjects = data.filter(p => p.status?.toLowerCase() === 'in-progress').length;
  const completedProjects = data.filter(p => p.status?.toLowerCase() === 'completed').length;
  const delayedProjects = data.filter(p => p.status?.toLowerCase() === 'delayed').length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Timelines</h3>
          <p className="text-sm text-gray-600">Current project schedules and progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Active ({onGoingProjects})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed ({completedProjects})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Delayed ({delayedProjects})</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((project, index) => {
          const progress = calculateProgress(project.start, project.end);
          const isHovered = hoveredProject === index;
          
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                isHovered ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(selectedProject === index ? null : index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{project.owner}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(project.start)} - {formatDate(project.end)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                  <span className={getStatusBadge(project.status)}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: getStatusColor(project.status)
                  }}
                ></div>
              </div>
              
              {/* Timeline visualization */}
              <div className="relative">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Start</span>
                  <span>End</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full relative">
                  <div 
                    className="absolute h-1 rounded-full"
                    style={{
                      backgroundColor: getStatusColor(project.status),
                      width: `${progress}%`,
                      left: '0%'
                    }}
                  ></div>
                  {/* Current time indicator */}
                  <div 
                    className="absolute w-0.5 h-3 bg-gray-700 -top-1"
                    style={{ left: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Expanded details */}
              {selectedProject === index && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Project Manager:</span>
                      <p className="text-gray-600">{project.owner}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <p className="text-gray-600">
                        {Math.ceil((new Date(project.end) - new Date(project.start)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-600">{project.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Progress:</span>
                      <p className="text-gray-600">{progress}% complete</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{onGoingProjects}</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{delayedProjects}</p>
            <p className="text-sm text-gray-600">Delayed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
