'use client'

import { AlertTriangle, Shield, Target, Clock } from 'lucide-react'

const defaultRiskData = [
  { id: '1', title: 'API Integration', category: 'Technical', severity: 'high' as const, probability: 0.8, impact: 0.9, status: 'open' as const, owner: 'Tech Lead', dueDate: '2025-07-01' },
  { id: '2', title: 'Resource Allocation', category: 'Resource', severity: 'medium' as const, probability: 0.6, impact: 0.7, status: 'mitigating' as const, owner: 'PM', dueDate: '2025-06-30' },
  { id: '3', title: 'Timeline Delay', category: 'Schedule', severity: 'medium' as const, probability: 0.4, impact: 0.6, status: 'open' as const, owner: 'PM', dueDate: '2025-07-15' },
  { id: '4', title: 'Quality Standards', category: 'Quality', severity: 'low' as const, probability: 0.3, impact: 0.4, status: 'closed' as const, owner: 'QA Lead', dueDate: '2025-06-25' },
  { id: '5', title: 'Stakeholder Buy-in', category: 'Business', severity: 'high' as const, probability: 0.5, impact: 0.8, status: 'mitigating' as const, owner: 'Product Owner', dueDate: '2025-07-10' },
  { id: '6', title: 'Technology Stack', category: 'Technical', severity: 'low' as const, probability: 0.2, impact: 0.5, status: 'open' as const, owner: 'Tech Lead', dueDate: '2025-08-01' }
]

interface Risk {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  status: 'open' | 'mitigating' | 'closed';
  owner: string;
  dueDate: string;
}

interface RiskHeatmapProps {
  risks?: Risk[];
}

const getRiskColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-600'
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getRiskIcon = (category: string) => {
  switch (category) {
    case 'Technical': return <Target className="h-4 w-4" />
    case 'Schedule': return <Clock className="h-4 w-4" />
    case 'Quality': return <Shield className="h-4 w-4" />
    default: return <AlertTriangle className="h-4 w-4" />
  }
}

export function RiskHeatmap({ risks }: RiskHeatmapProps = {}) {
  const riskData = risks || defaultRiskData;
  const highRisks = riskData.filter(risk => risk.severity === 'high' || risk.severity === 'critical').length
  const mediumRisks = riskData.filter(risk => risk.severity === 'medium').length
  const lowRisks = riskData.filter(risk => risk.severity === 'low').length

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          <p className="text-sm text-gray-600">Current project risk overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High ({highRisks})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium ({mediumRisks})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low ({lowRisks})</span>
          </div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Matrix</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* Header */}
          <div></div>
          <div className="text-center font-medium">Low</div>
          <div className="text-center font-medium">Medium</div>
          <div className="text-center font-medium">High</div>
          
          {/* High Probability */}
          <div className="text-right font-medium py-2">High</div>
          <div className="aspect-square bg-yellow-200 rounded flex items-center justify-center">2</div>
          <div className="aspect-square bg-red-200 rounded flex items-center justify-center">1</div>
          <div className="aspect-square bg-red-500 rounded flex items-center justify-center text-white">1</div>
          
          {/* Medium Probability */}
          <div className="text-right font-medium py-2">Medium</div>
          <div className="aspect-square bg-green-200 rounded flex items-center justify-center">0</div>
          <div className="aspect-square bg-yellow-200 rounded flex items-center justify-center">1</div>
          <div className="aspect-square bg-red-200 rounded flex items-center justify-center">1</div>
          
          {/* Low Probability */}
          <div className="text-right font-medium py-2">Low</div>
          <div className="aspect-square bg-green-200 rounded flex items-center justify-center">1</div>
          <div className="aspect-square bg-green-200 rounded flex items-center justify-center">1</div>
          <div className="aspect-square bg-yellow-200 rounded flex items-center justify-center">0</div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">Impact →</div>
      </div>

      {/* Risk List */}
      <div className="space-y-3">
        {riskData.slice(0, 4).map((risk) => (
          <div key={risk.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.severity)}`}></div>
              <div className="text-gray-600">
                {getRiskIcon(risk.category)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{risk.title}</p>
                <p className="text-xs text-gray-600">{risk.category} • Impact {Math.round(risk.impact * 100)}%</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View Full Risk Register →
        </button>
      </div>
    </div>
  )
}

