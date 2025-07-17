// src/components/RiskMatrix.js
import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RiskMatrix = ({ data }) => {
  const [hoveredRisk, setHoveredRisk] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  
  // Transform data for recharts
  const chartData = data.map(risk => ({
    ...risk,
    x: risk.likelihood,
    y: risk.impact,
    severity: risk.severity || 'medium',
    size: 100
  }));
  
  const getRiskColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };
  
  const riskCounts = {
    critical: data.filter(r => r.severity === 'critical').length,
    high: data.filter(r => r.severity === 'high').length,
    medium: data.filter(r => r.severity === 'medium').length,
    low: data.filter(r => r.severity === 'low').length
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-900">{data.title}</p>
          <p className="text-sm text-gray-600">Likelihood: {data.likelihood}</p>
          <p className="text-sm text-gray-600">Impact: {data.impact}</p>
          <p className="text-sm text-gray-600">Severity: {data.severity}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          <p className="text-sm text-gray-600">Project risk analysis matrix</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High ({riskCounts.high + riskCounts.critical})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium ({riskCounts.medium})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low ({riskCounts.low})</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Likelihood', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Impact', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey="size">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.severity)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Risks</h4>
        <div className="space-y-2">
          {data.slice(0, 3).map((risk, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: getRiskColor(risk.severity)}}></div>
                <span className="text-sm font-medium text-gray-900">{risk.title}</span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.severity?.charAt(0).toUpperCase() + risk.severity?.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;

