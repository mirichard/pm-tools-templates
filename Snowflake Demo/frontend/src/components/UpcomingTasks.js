// src/components/UpcomingTasks.js
import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

const UpcomingTasks = ({ data }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { icon: CheckCircle, color: 'text-green-600' };
      case 'in-progress': return { icon: Clock, color: 'text-blue-600' };
      case 'overdue': return { icon: AlertCircle, color: 'text-red-600' };
      default: return { icon: Clock, color: 'text-gray-600' };
    }
  };
  
  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    switch (status?.toLowerCase()) {
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'overdue': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };
  
  const completedTasks = data.filter(t => t.status?.toLowerCase() === 'completed').length;
  const inProgressTasks = data.filter(t => t.status?.toLowerCase() === 'in-progress').length;
  const overdueTasks = data.filter(t => t.status?.toLowerCase() === 'overdue').length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
          <p className="text-sm text-gray-600">Current task status and priorities</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Active ({inProgressTasks})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed ({completedTasks})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Overdue ({overdueTasks})</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((task) => {
          const statusInfo = getStatusIcon(task.status);
          const StatusIcon = statusInfo.icon;
          const isSelected = selectedTask === task.task_id;
          
          return (
            <div
              key={task.task_id}
              className={`border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedTask(isSelected ? null : task.task_id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.task_name || task.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">Task #{task.task_id}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">Milestone {task.milestone_id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(task.status)}>
                    {task.status}
                  </span>
                  {task.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Assigned to:</span>
                      <p className="text-gray-600">{task.assignee || 'Unassigned'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Due Date:</span>
                      <p className="text-gray-600">{task.due_date || 'No deadline'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Priority:</span>
                      <p className="text-gray-600">{task.priority || 'Normal'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Progress:</span>
                      <p className="text-gray-600">{task.progress || 0}%</p>
                    </div>
                  </div>
                  {task.description && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((completedTasks / data.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasks;
