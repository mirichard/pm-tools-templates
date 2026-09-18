'use client'

import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts'
import { Loader } from 'lucide-react'

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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Project Progress
            {loading && <Loader className="w-4 h-4 animate-spin text-blue-600" role="img" />}
          </h3>
          <p className="text-sm text-gray-600">Planned vs Actual completion over time</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          {legendItems.map((item) => (
            <div key={item.key} className="relative group">
              <button
                onClick={() => toggleLine(item.key)}
                onMouseEnter={() => setHoveredLegend(item.key)}
                onMouseLeave={() => setHoveredLegend(null)}
                className={`flex items-center space-x-2 px-2 py-1 rounded transition-all duration-200 ${
                  hiddenLines.has(item.key) 
                    ? 'opacity-50 bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    hoveredLegend === item.key ? 'scale-125 shadow-md' : ''
                  }`}
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className={hiddenLines.has(item.key) ? 'line-through' : ''}>
                  {item.label}
                </span>
              </button>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">85%</p>
          <p className="text-sm text-gray-600">Target Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">78%</p>
          <p className="text-sm text-gray-600">Actual Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600">-7%</p>
          <p className="text-sm text-gray-600">Variance</p>
        </div>
      </div>
    </div>
  )
}

