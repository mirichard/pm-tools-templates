'use client'

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

/**
 * Enhanced Dashboard Page demonstrating Donald Norman design principles:
 * 1. Visibility - Clear visual hierarchy and status indicators
 * 2. Feedback - Immediate responses to user actions
 * 3. Constraints - Preventing user errors with proper states
 * 4. Mapping - Intuitive relationship between controls and effects
 * 5. Consistency - Uniform design patterns throughout
 * 6. Affordances - Clear indications of how elements can be used
 */
export default function EnhancedDashboardPage() {
  const handleMetricClick = (metricName: string) => {
    console.log(`Clicked metric: ${metricName}`);
    // In a real app, this might navigate to detailed view or open a modal
  };

  return (
    <DashboardLayout>
      {/* Page Header with clear hierarchy */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Enhanced Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Project management dashboard following Donald Norman design principles
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time updates</span>
          </div>
        </div>
      </div>

      {/* Critical Metrics - High priority visibility */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Critical Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Schedule Performance"
            value="78%"
            trend={-7}
            trendDirection="down"
            icon={Calendar}
            color="red"
            priority="critical"
            lastUpdated={new Date(Date.now() - 5 * 60000)} // 5 minutes ago
            onClick={() => handleMetricClick('Schedule Performance')}
            description="Current project schedule performance compared to baseline. Critical threshold breached - requires immediate attention."
          />
          
          <MetricCard
            title="Team Capacity"
            value="92%"
            trend={5.2}
            trendDirection="up"
            icon={Users}
            color="yellow"
            priority="high"
            lastUpdated={new Date(Date.now() - 2 * 60000)} // 2 minutes ago
            onClick={() => handleMetricClick('Team Capacity')}
            description="Current team utilization rate. High utilization may lead to burnout if sustained."
          />
          
          <MetricCard
            title="Quality Score"
            value="95%"
            trend={8.5}
            trendDirection="up"
            icon={CheckCircle}
            color="green"
            priority="low"
            lastUpdated={new Date(Date.now() - 1 * 60000)} // 1 minute ago
            onClick={() => handleMetricClick('Quality Score')}
            description="Overall quality metrics including test coverage, bug resolution rate, and code review scores."
          />
          
          <MetricCard
            title="Budget Variance"
            value="$15.2K"
            trend={-2.3}
            trendDirection="down"
            icon={Target}
            color="blue"
            priority="medium"
            lastUpdated={new Date(Date.now() - 10 * 60000)} // 10 minutes ago
            onClick={() => handleMetricClick('Budget Variance')}
            description="Current budget variance from planned allocation. Negative variance indicates over-budget spending."
          />
        </div>
      </div>

      {/* Performance Metrics - Lower priority but important */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Sprint Velocity"
            value="42"
            trend={12.8}
            trendDirection="up"
            icon={TrendingUp}
            color="green"
            onClick={() => handleMetricClick('Sprint Velocity')}
            description="Average story points completed per sprint over the last 6 sprints."
          />
          
          <MetricCard
            title="Cycle Time"
            value="3.2d"
            trend={-8.1}
            trendDirection="down"
            icon={Clock}
            color="green"
            onClick={() => handleMetricClick('Cycle Time')}
            description="Average time from work start to completion. Lower is better."
          />
          
          <MetricCard
            title="Defect Rate"
            value="0.8%"
            trend={-15.3}
            trendDirection="down"
            icon={AlertTriangle}
            color="green"
            onClick={() => handleMetricClick('Defect Rate')}
            description="Percentage of deliverables with defects. Downward trend is positive."
          />
        </div>
      </div>

      {/* Progress Charts - Visual data representation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Progress Tracking
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Review Sprint Planning', urgency: 'high', due: '2 hours' },
                { action: 'Update Risk Register', urgency: 'medium', due: '1 day' },
                { action: 'Team Retrospective', urgency: 'low', due: '3 days' },
                { action: 'Stakeholder Review', urgency: 'high', due: '4 hours' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${
                      item.urgency === 'high' ? 'bg-red-500' : 
                      item.urgency === 'medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.action}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Due in {item.due}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State Demo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Loading States Demo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Loading Metric"
            value="--"
            trend={0}
            trendDirection="up"
            icon={Clock}
            color="gray"
            isLoading={true}
            description="This demonstrates the loading state with proper feedback."
          />
          
          <ProgressChart loading={true} />
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Dashboard Features
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Click on metric cards to view detailed information</li>
          <li>• Toggle chart data series by clicking legend items</li>
          <li>• Use the help mode button in the header for guided tooltips</li>
          <li>• Switch between light and dark themes using the theme toggle</li>
          <li>• All interactions provide immediate visual feedback</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
