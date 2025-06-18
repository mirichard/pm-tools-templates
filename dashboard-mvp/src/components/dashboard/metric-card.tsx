import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  trend: number
  trendDirection: 'up' | 'down'
  icon: LucideIcon
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'indigo'
}

const colorVariants = {
  green: {
    icon: 'text-green-600',
    bg: 'bg-green-50',
    trend: 'text-green-600'
  },
  yellow: {
    icon: 'text-yellow-600',
    bg: 'bg-yellow-50',
    trend: 'text-yellow-600'
  },
  red: {
    icon: 'text-red-600',
    bg: 'bg-red-50',
    trend: 'text-red-600'
  },
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    trend: 'text-blue-600'
  },
  gray: {
    icon: 'text-gray-600',
    bg: 'bg-gray-50',
    trend: 'text-gray-600'
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50',
    trend: 'text-purple-600'
  },
  indigo: {
    icon: 'text-indigo-600',
    bg: 'bg-indigo-50',
    trend: 'text-indigo-600'
  }
}

export function MetricCard({ title, value, trend, trendDirection, icon: Icon, color }: MetricCardProps) {
  const variant = colorVariants[color]
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg', variant.bg)}>
            <Icon className={cn('h-6 w-6', variant.icon)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <div className={cn('flex items-center space-x-1', 
          trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {trendDirection === 'up' && <TrendingUp className="h-4 w-4" />}
          {trendDirection === 'down' && <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {trendDirection === 'up' ? '+' : ''}{trend}%
          </span>
        </div>
      </div>
    </div>
  )
}

