'use client'

import { useState } from 'react'
import { 
  Activity, 
  Bell, 
  Settings, 
  Search, 
  BarChart3,
  Users,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface DashboardHeaderProps {
  onExportClick?: () => void;
  onSettingsClick?: () => void;
}

export function DashboardHeader({ onExportClick, onSettingsClick }: DashboardHeaderProps = {}) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">PM Dashboard</h1>
            </div>
            <span className="text-sm text-gray-500 border-l pl-4">Project Health Monitor</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#" 
              className="flex items-center space-x-1 text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
            >
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            {/* Export */}
            <button
              onClick={onExportClick}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Export dashboard"
            >
              <Download className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button 
              onClick={onSettingsClick}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Dashboard settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Project Selector */}
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="pm-tools">PM Tools Templates</option>
              <option value="dashboard-mvp">Dashboard MVP</option>
              <option value="workflow-lib">Workflow Library</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-t border-gray-100 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>System Status: Operational</span>
              </span>
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Data Range: Last 30 days</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

