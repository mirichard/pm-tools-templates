'use client'

import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

const defaultProgressData = [
  { week: 'Week 1', planned: 20, actual: 18, issues: 5 },
  { week: 'Week 2', planned: 35, actual: 32, issues: 8 },
  { week: 'Week 3', planned: 50, actual: 48, issues: 6 },
  { week: 'Week 4', planned: 65, actual: 61, issues: 4 },
  { week: 'Week 5', planned: 78, actual: 75, issues: 3 },
  { week: 'Week 6', planned: 85, actual: 78, issues: 2 }
]

interface ProgressChartProps {
  data?: Array<{
    week: string;
    planned: number;
    actual: number;
    issues: number;
  }>;
  loading?: boolean;
}

export function ProgressChart({ data, loading = false }: ProgressChartProps = {}) {
  const progressData = data || defaultProgressData;
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);
  
  const legendItems = [
    { key: 'planned', label: 'Planned', color: '#3b82f6', description: 'Target completion percentage' },
    { key: 'actual', label: 'Actual', color: '#10b981', description: 'Current completion percentage' },
    { key: 'issues', label: 'Issues', color: '#ef4444', description: 'Number of issues encountered' }
  ];
  
  const toggleLine = (key: string) => {
    const newHiddenLines = new Set(hiddenLines);
    if (newHiddenLines.has(key)) {
      newHiddenLines.delete(key);
    } else {
      newHiddenLines.add(key);
    }
    setHiddenLines(newHiddenLines);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Project Progress
            {loading && <Loader className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" role="img" aria-label="Loading progress data" />}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Planned vs Actual completion over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {legendItems.map((item) => {
            const isHidden = hiddenLines.has(item.key);
            return (
              <div key={item.key} className="relative group">
                <button
                  onClick={() => toggleLine(item.key)}
                  onMouseEnter={() => setHoveredLegend(item.key)}
                  onMouseLeave={() => setHoveredLegend(null)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    isHidden 
                      ? 'opacity-50 bg-gray-100 dark:bg-gray-700' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                    hoveredLegend === item.key && 'bg-gray-100 dark:bg-gray-700'
                  )}
                  aria-pressed={!isHidden}
                  aria-label={`${isHidden ? 'Show' : 'Hide'} ${item.label} data`}
                >
                  <div 
                    className={cn(
                      'w-3 h-3 rounded-full transition-all duration-200 border-2',
                      hoveredLegend === item.key && !isHidden ? 'scale-125 shadow-md' : '',
                      isHidden ? 'border-gray-300 dark:border-gray-600' : 'border-white dark:border-gray-800'
                    )}
                    style={{ 
                      backgroundColor: isHidden ? 'transparent' : item.color,
                      borderColor: isHidden ? undefined : item.color
                    }}
                    aria-hidden="true"
                  ></div>
                  <span className={cn(
                    'font-medium text-gray-700 dark:text-gray-300',
                    isHidden && 'line-through'
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Visual feedback for interactivity */}
                  <span className="sr-only">
                    {isHidden ? '(Hidden)' : '(Visible)'}
                  </span>
                </button>
                
                {/* Enhanced tooltip with better positioning */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-lg">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-gray-300 dark:text-gray-400">{item.description}</div>
                  
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-80 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-lg z-10">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span>Loading progress data...</span>
            </div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="opacity-30" 
              stroke="currentColor"
            />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-gray-600 dark:text-gray-300"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              label={{ 
                value: 'Completion %', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
              className="text-gray-600 dark:text-gray-300"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, white)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: 'var(--tooltip-text, #1f2937)'
              }}
              labelStyle={{ 
                color: 'var(--tooltip-text, #1f2937)',
                fontWeight: 'bold'
              }}
              cursor={{ 
                stroke: '#3b82f6', 
                strokeWidth: 1, 
                strokeDasharray: '5 5'
              }}
            />
            {!hiddenLines.has('planned') && (
              <Line 
                type="monotone" 
                dataKey="planned" 
                stroke="#3b82f6" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            )}
            {!hiddenLines.has('actual') && (
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
              />
            )}
            {!hiddenLines.has('issues') && (
              <Line 
                type="monotone" 
                dataKey="issues" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {loading ? '...' : '85%'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Target Progress</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Based on project timeline
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {loading ? '...' : '78%'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Actual Progress</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Current completion rate
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20">
          <p className={cn(
            'text-2xl font-bold',
            loading ? 'text-gray-400' : 'text-red-600 dark:text-red-400'
          )}>
            {loading ? '...' : '-7%'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Variance</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Behind schedule
          </div>
        </div>
      </div>
    </div>
  )
}

