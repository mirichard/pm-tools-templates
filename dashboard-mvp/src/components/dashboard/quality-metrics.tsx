'use client'

import { Bug, Shield, CheckCircle, AlertCircle } from 'lucide-react'

const qualityData = {
  testCoverage: 87,
  codeQuality: 92,
  bugs: {
    critical: 0,
    high: 1,
    medium: 3,
    low: 2
  },
  defectRate: 0.12,
  codeReviewCoverage: 98
}

interface QualityMetricsData {
  testCoverage: number;
  defectRate: number;
  codeReviewCoverage: number;
  bugsByCriticality: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface QualityMetricsProps {
  metrics?: QualityMetricsData;
}

export function QualityMetrics({ metrics }: QualityMetricsProps = {}) {
  const totalBugs = Object.values(qualityData.bugs).reduce((a, b) => a + b, 0)
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
          <p className="text-sm text-gray-600">Code quality and testing overview</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{qualityData.codeQuality}%</p>
          <p className="text-sm text-gray-600">Quality Score</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Test Coverage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Test Coverage</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${qualityData.testCoverage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{qualityData.testCoverage}%</span>
          </div>
        </div>

        {/* Code Review Coverage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Code Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${qualityData.codeReviewCoverage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{qualityData.codeReviewCoverage}%</span>
          </div>
        </div>

        {/* Defect Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bug className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-900">Defect Rate</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{qualityData.defectRate}%</span>
        </div>
      </div>

      {/* Bug Breakdown */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Open Issues ({totalBugs})</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-red-50 rounded">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-900">Critical</span>
            </div>
            <span className="text-sm font-bold text-red-900">{qualityData.bugs.critical}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-900">High</span>
            </div>
            <span className="text-sm font-bold text-orange-900">{qualityData.bugs.high}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-900">Medium</span>
            </div>
            <span className="text-sm font-bold text-yellow-900">{qualityData.bugs.medium}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-900">Low</span>
            </div>
            <span className="text-sm font-bold text-green-900">{qualityData.bugs.low}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

