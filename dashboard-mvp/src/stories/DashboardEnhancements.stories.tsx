import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
import { ToastProvider } from '@/components/ui/toast'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSettings } from '@/components/dashboard/DashboardSettings'
import { ExportDialog } from '@/components/dashboard/ExportDialog'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { TeamPerformance } from '@/components/dashboard/team-performance'
import { RiskHeatmap } from '@/components/dashboard/risk-heatmap'
import { TrendingUp, Clock, Target, AlertTriangle, Users } from 'lucide-react'

// Wrapper for components that need ToastProvider
const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
)

// Mock API service for Storybook
const mockApiService = {
  exportDashboard: (format: string) => 
    new Promise(resolve => 
      setTimeout(() => resolve(new Blob()), 1000)
    )
}

// Toast Notification System Stories
const toastMeta: Meta<typeof ToastWrapper> = {
  title: 'Dashboard/Toast System',
  component: ToastWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Toast notification system providing user feedback for dashboard actions'
      }
    }
  }
}

export default toastMeta

export const ToastSystem: StoryObj<typeof ToastWrapper> = {
  render: () => (
    <ToastWrapper>
      <DashboardHeader 
        onExportClick={action('export-clicked')} 
        onSettingsClick={action('settings-clicked')} 
      />
    </ToastWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const refreshButton = canvas.getByTitle('Refresh data')
    
    await userEvent.click(refreshButton)
    
    // Toast should appear
    await expect(canvas.getByText(/Dashboard refreshed|Refresh failed/)).toBeInTheDocument()
  }
}

// Enhanced Header Navigation Stories
const headerMeta: Meta<typeof DashboardHeader> = {
  title: 'Dashboard/Enhanced Header',
  component: DashboardHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Enhanced header with improved navigation, feedback, and accessibility'
      }
    }
  },
  decorators: [
    (Story) => (
      <ToastWrapper>
        <Story />
      </ToastWrapper>
    )
  ]
}

export const EnhancedHeader: StoryObj<typeof DashboardHeader> = {
  render: () => (
    <DashboardHeader 
      onExportClick={action('export-clicked')} 
      onSettingsClick={action('settings-clicked')} 
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test navigation
    const teamButton = canvas.getByRole('button', { name: /team/i })
    await userEvent.click(teamButton)
    
    // Should have active state
    await expect(teamButton).toHaveAttribute('aria-current', 'page')
    
    // Test refresh functionality
    const refreshButton = canvas.getByTitle('Refresh data')
    await userEvent.click(refreshButton)
    
    // Should show loading state
    await expect(refreshButton).toHaveClass('animate-spin')
  }
}

// Enhanced Settings Dialog Stories
const settingsMeta: Meta<typeof DashboardSettings> = {
  title: 'Dashboard/Enhanced Settings',
  component: DashboardSettings,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced settings dialog with toast feedback and better UX'
      }
    }
  },
  decorators: [
    (Story) => (
      <ToastWrapper>
        <Story />
      </ToastWrapper>
    )
  ]
}

export const EnhancedSettings: StoryObj<typeof DashboardSettings> = {
  args: {
    isOpen: true,
    onClose: action('close'),
    onSettingsChange: action('settings-changed')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test tab navigation
    const layoutTab = canvas.getByRole('button', { name: /layout/i })
    await userEvent.click(layoutTab)
    
    // Test settings change
    const gridButton = canvas.getByRole('button', { name: /3 columns/i })
    await userEvent.click(gridButton)
    
    // Test save functionality
    const saveButton = canvas.getByRole('button', { name: /save settings/i })
    await userEvent.click(saveButton)
    
    // Toast should appear
    await expect(canvas.getByText('Settings saved')).toBeInTheDocument()
  }
}

// Enhanced Export Dialog Stories
const exportMeta: Meta<typeof ExportDialog> = {
  title: 'Dashboard/Enhanced Export',
  component: ExportDialog,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced export dialog with improved visual hierarchy and format selection'
      }
    }
  }
}

export const EnhancedExport: StoryObj<typeof ExportDialog> = {
  args: {
    isOpen: true,
    onClose: action('close')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test format selection
    const csvButton = canvas.getByRole('button', { name: /csv/i })
    await userEvent.click(csvButton)
    
    // Should have selection indicator
    await expect(csvButton).toHaveClass('border-blue-500')
    
    // Test export process
    const exportButton = canvas.getByRole('button', { name: /export csv/i })
    await userEvent.click(exportButton)
    
    // Should show loading state
    await expect(canvas.getByText('Exporting...')).toBeInTheDocument()
  }
}

// Enhanced Metric Cards Stories
const metricMeta: Meta<typeof MetricCard> = {
  title: 'Dashboard/Enhanced Metric Cards',
  component: MetricCard,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced metric cards with hover effects, click interactions, and tooltips'
      }
    }
  }
}

export const InteractiveMetricCard: StoryObj<typeof MetricCard> = {
  args: {
    title: 'Schedule Performance',
    value: '85%',
    trend: 5.2,
    trendDirection: 'up',
    icon: TrendingUp,
    color: 'blue',
    onClick: action('metric-clicked'),
    description: 'Current project schedule performance compared to baseline'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const card = canvas.getByRole('button')
    
    // Test hover effects
    await userEvent.hover(card)
    await expect(card).toHaveClass('transform', 'scale-105')
    
    // Test click interaction
    await userEvent.click(card)
    await expect(card).toHaveClass('animate-pulse')
  }
}

export const MetricCardVariants: StoryObj<typeof MetricCard> = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <MetricCard
        title="High Performance"
        value="95%"
        trend={8.5}
        trendDirection="up"
        icon={TrendingUp}
        color="green"
        onClick={action('green-clicked')}
      />
      <MetricCard
        title="Warning Level"
        value="65%"
        trend={-2.3}
        trendDirection="down"
        icon={AlertTriangle}
        color="yellow"
        onClick={action('yellow-clicked')}
      />
      <MetricCard
        title="Critical Issue"
        value="35%"
        trend={-5.7}
        trendDirection="down"
        icon={AlertTriangle}
        color="red"
        onClick={action('red-clicked')}
      />
    </div>
  )
}

// Enhanced Progress Chart Stories
const chartMeta: Meta<typeof ProgressChart> = {
  title: 'Dashboard/Enhanced Progress Chart',
  component: ProgressChart,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced progress chart with interactive legend and loading states'
      }
    }
  }
}

export const InteractiveProgressChart: StoryObj<typeof ProgressChart> = {
  args: {
    loading: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test legend interaction
    const plannedLegend = canvas.getByRole('button', { name: /planned/i })
    
    // Test hover tooltip
    await userEvent.hover(plannedLegend)
    await expect(canvas.getByText('Target completion percentage')).toBeInTheDocument()
    
    // Test toggle functionality
    await userEvent.click(plannedLegend)
    await expect(plannedLegend).toHaveClass('opacity-50')
  }
}

export const LoadingProgressChart: StoryObj<typeof ProgressChart> = {
  args: {
    loading: true
  }
}

// Enhanced Team Performance Stories
const teamMeta: Meta<typeof TeamPerformance> = {
  title: 'Dashboard/Enhanced Team Performance',
  component: TeamPerformance,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced team performance with status indicators and threshold alerts'
      }
    }
  },
  decorators: [
    (Story) => (
      <ToastWrapper>
        <Story />
      </ToastWrapper>
    )
  ]
}

export const InteractiveTeamPerformance: StoryObj<typeof TeamPerformance> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test team member interaction
    const firstMember = canvas.getAllByRole('button')[0]
    
    // Test hover effects
    await userEvent.hover(firstMember)
    await expect(firstMember).toHaveClass('bg-blue-50')
    
    // Test click interaction
    await userEvent.click(firstMember)
    
    // Should show toast notification
    await expect(canvas.getByText(/performance details|overutilized|additional capacity/)).toBeInTheDocument()
  }
}

// Enhanced Risk Heatmap Stories
const riskMeta: Meta<typeof RiskHeatmap> = {
  title: 'Dashboard/Enhanced Risk Heatmap',
  component: RiskHeatmap,
  parameters: {
    docs: {
      description: {
        component: 'Enhanced risk heatmap with interactive elements and hover states'
      }
    }
  }
}

export const InteractiveRiskHeatmap: StoryObj<typeof RiskHeatmap> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Test matrix interaction would go here
    // (depends on implementation of matrix hover states)
  }
}

// Accessibility Stories
export const AccessibilityDemo: StoryObj<typeof MetricCard> = {
  name: 'Accessibility Features',
  args: {
    title: 'Accessible Metric',
    value: '85%',
    trend: 5.2,
    trendDirection: 'up',
    icon: TrendingUp,
    color: 'blue',
    onClick: action('accessible-click'),
    description: 'This metric demonstrates accessibility features'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const card = canvas.getByRole('button')
    
    // Test keyboard navigation
    card.focus()
    await expect(card).toHaveFocus()
    
    // Test keyboard interaction
    await userEvent.keyboard('{Enter}')
    await expect(card).toHaveClass('animate-pulse')
    
    // Test ARIA attributes
    await expect(card).toHaveAttribute('tabIndex', '0')
  }
}

// Performance Stories
export const PerformanceDemo: StoryObj<typeof MetricCard> = {
  name: 'Performance Optimizations',
  args: {
    title: 'Performance Test',
    value: '85%',
    trend: 5.2,
    trendDirection: 'up',
    icon: TrendingUp,
    color: 'blue',
    onClick: action('performance-click')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const card = canvas.getByRole('button')
    
    // Test rapid clicking (debouncing)
    await userEvent.click(card)
    await userEvent.click(card)
    await userEvent.click(card)
    
    // Should handle rapid clicks gracefully
    await expect(card).toHaveClass('animate-pulse')
  }
}

// Error Handling Stories
export const ErrorHandlingDemo: StoryObj<typeof ExportDialog> = {
  name: 'Error Handling',
  args: {
    isOpen: true,
    onClose: action('close')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Mock API failure
    const originalApi = (window as any).apiService
    ;(window as any).apiService = {
      exportDashboard: () => Promise.reject(new Error('Export failed'))
    }
    
    const exportButton = canvas.getByRole('button', { name: /export pdf/i })
    await userEvent.click(exportButton)
    
    // Should show error message
    await expect(canvas.getByText('Export failed. Please try again.')).toBeInTheDocument()
    
    // Restore original API
    ;(window as any).apiService = originalApi
  }
}
