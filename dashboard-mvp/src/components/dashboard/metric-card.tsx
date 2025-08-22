import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, LucideIcon, Info, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react'
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
  priority?: 'low' | 'medium' | 'high' | 'critical'
  lastUpdated?: Date
  isLoading?: boolean
  helpMode?: boolean
}

const colorVariants = {
  green: {
    icon: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    trend: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    shadow: 'shadow-green-100 dark:shadow-green-900/20'
  },
  yellow: {
    icon: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    trend: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    shadow: 'shadow-yellow-100 dark:shadow-yellow-900/20'
  },
  red: {
    icon: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    trend: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    shadow: 'shadow-red-100 dark:shadow-red-900/20'
  },
  blue: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    trend: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    shadow: 'shadow-blue-100 dark:shadow-blue-900/20'
  },
  gray: {
    icon: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    trend: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    shadow: 'shadow-gray-100 dark:shadow-gray-900/20'
  },
  purple: {
    icon: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    trend: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    shadow: 'shadow-purple-100 dark:shadow-purple-900/20'
  },
  indigo: {
    icon: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    trend: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
    shadow: 'shadow-indigo-100 dark:shadow-indigo-900/20'
  }
}

const priorityIndicators = {
  low: { color: 'bg-gray-400', label: 'Low priority' },
  medium: { color: 'bg-blue-500', label: 'Medium priority' },
  high: { color: 'bg-yellow-500', label: 'High priority' },
  critical: { color: 'bg-red-500', label: 'Critical priority' }
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  trendDirection, 
  icon: Icon, 
  color, 
  onClick, 
  description,
  priority = 'medium',
  lastUpdated,
  isLoading = false,
  helpMode = false
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const variant = colorVariants[color]
  const priorityInfo = priorityIndicators[priority]
  
  // Auto-hide loading state after reasonable timeout to prevent stuck states
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        // In real app, this would trigger error handling
        console.warn('Metric card loading timeout');
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading])
  
  const handleClick = () => {
    if (onClick && !isLoading) {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 300)
      onClick()
    }
  }
  
  // Enhanced keyboard handling for better accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleClick()
    }
  }
  
  const isClickable = Boolean(onClick) && !isLoading
  
  // Determine status based on trend and priority
  const getStatusIcon = () => {
    if (isLoading) return null;
    if (priority === 'critical') return AlertTriangle;
    if (trendDirection === 'up' && trend > 0) return CheckCircle;
    if (trendDirection === 'down' && trend < -5) return AlertTriangle;
    return null;
  }
  
  const StatusIcon = getStatusIcon();
  const timeAgo = lastUpdated ? `Updated ${Math.floor((Date.now() - lastUpdated.getTime()) / 60000)}m ago` : null;
  
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300',
        'relative overflow-hidden',
        isClickable && 'cursor-pointer hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600',
        !isClickable && 'hover:shadow-md',
        isPulsing && 'animate-pulse',
        isHovered && isClickable && 'transform scale-105',
        isLoading && 'opacity-75',
        priority === 'critical' && 'ring-2 ring-red-200 dark:ring-red-800',
        priority === 'high' && 'ring-1 ring-yellow-200 dark:ring-yellow-800'
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        if (helpMode || description) setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onClick={handleClick}
      role={isClickable ? 'button' : 'region'}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${value}${description ? `. ${description}` : ''}`}
      aria-disabled={isLoading}
    >
      {/* Priority indicator - Visual hierarchy enhancement */}
      {priority !== 'medium' && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-current" 
          style={{ color: priorityInfo.color.replace('bg-', '') }}
          aria-hidden="true"
        />
      )}
      
      {/* Loading overlay with clear feedback */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'p-2 rounded-lg transition-all duration-200 relative',
            variant.bg,
            isHovered && isClickable && 'shadow-md'
          )}>
            <Icon className={cn(
              'h-6 w-6 transition-all duration-200',
              variant.icon,
              isHovered && isClickable && 'scale-110',
              isLoading && 'opacity-50'
            )} />
            
            {/* Status indicator overlay */}
            {StatusIcon && !isLoading && (
              <StatusIcon className={cn(
                'absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white dark:bg-gray-800 p-0.5',
                priority === 'critical' ? 'text-red-500' : 'text-green-500'
              )} />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
              {timeAgo && (
                <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo}</span>
              )}
            </div>
            <p className={cn(
              'text-2xl font-bold transition-all duration-200',
              isLoading ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white',
              isHovered && isClickable && !isLoading && 'text-blue-600 dark:text-blue-400'
            )}>
              {isLoading ? '---' : value}
            </p>
          </div>
        </div>
        
        {/* Enhanced affordance indicators */}
        <div className="flex items-center space-x-2">
          {isClickable && (
            <div className={cn(
              'opacity-0 transition-opacity duration-200',
              isHovered && !isLoading && 'opacity-100'
            )}>
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          {priority !== 'medium' && (
            <div className={cn(
              'h-2 w-2 rounded-full',
              priorityInfo.color
            )} 
              title={priorityInfo.label}
              aria-label={priorityInfo.label}
            />
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        {/* Enhanced trend display with better visual mapping */}
        <div className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium transition-all duration-200',
          !isLoading && (
            trendDirection === 'up' 
              ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
              : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
          ),
          isLoading && 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800'
        )}>
          {!isLoading && trendDirection === 'up' && <TrendingUp className="h-4 w-4" />}
          {!isLoading && trendDirection === 'down' && <TrendingDown className="h-4 w-4" />}
          <span>
            {isLoading ? 'Loading...' : `${trendDirection === 'up' ? '+' : ''}${trend}%`}
          </span>
          {!isLoading && (
            <span className="sr-only">
              {trendDirection === 'up' ? 'Trending upward' : 'Trending downward'} by {Math.abs(trend)} percent
            </span>
          )}
        </div>
        
        {/* Enhanced help and description with better affordance */}
        <div className="flex items-center space-x-2">
          {description && (
            <div className="relative">
              <Info 
                className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help transition-colors duration-200 hover:text-blue-500 dark:hover:text-blue-400" 
                role="img" 
                aria-label="More information available"
              />
              
              {/* Enhanced tooltip with better positioning and readability */}
              <div className={cn(
                'absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-20',
                'transition-all duration-200',
                showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
              )}>
                <div className="font-medium mb-1">{title} Details</div>
                <div className="text-gray-300 dark:text-gray-400">{description}</div>
                
                {/* Tooltip arrow */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </div>
          )}
          
          {/* Help mode indicator */}
          {helpMode && (
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" 
              title="Help mode active"
              aria-label="Help mode active"
            />
          )}
        </div>
      </div>
    </div>
  )
}

