import { ReactNode, useState } from 'react'
import { TrendingUp, TrendingDown, LucideIcon, Info, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  trend: number
  trendDirection: 'up' | 'down'
  icon: LucideIcon
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'indigo'
  onClick?: () => void
  description?: string
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

export function MetricCard({ title, value, trend, trendDirection, icon: Icon, color, onClick, description }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const variant = colorVariants[color]
  
  const handleClick = () => {
    if (onClick) {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 300)
      onClick()
    }
  }
  
  const isClickable = Boolean(onClick)
  
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm border p-6 transition-all duration-300',
        isClickable && 'cursor-pointer hover:shadow-lg hover:border-blue-200',
        !isClickable && 'hover:shadow-md',
        isPulsing && 'animate-pulse',
        isHovered && isClickable && 'transform scale-105'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'p-2 rounded-lg transition-all duration-200',
            variant.bg,
            isHovered && isClickable && 'shadow-md'
          )}>
            <Icon className={cn(
              'h-6 w-6 transition-all duration-200',
              variant.icon,
              isHovered && isClickable && 'scale-110'
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={cn(
              'text-2xl font-bold text-gray-900 transition-all duration-200',
              isHovered && isClickable && 'text-blue-600'
            )}>{value}</p>
          </div>
        </div>
        
        {isClickable && (
          <div className={cn(
            'opacity-0 transition-opacity duration-200',
            isHovered && 'opacity-100'
          )}>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className={cn('flex items-center space-x-1', 
          trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {trendDirection === 'up' && <TrendingUp className="h-4 w-4" />}
          {trendDirection === 'down' && <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {trendDirection === 'up' ? '+' : ''}{trend}%
          </span>
        </div>
        
        {description && (
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" role="img" />
            <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

