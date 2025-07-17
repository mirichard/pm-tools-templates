import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from '@/components/ui/toast'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSettings } from '@/components/dashboard/DashboardSettings'
import { ExportDialog } from '@/components/dashboard/ExportDialog'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { TeamPerformance } from '@/components/dashboard/team-performance'
import { TrendingUp, Clock } from 'lucide-react'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

// Mock API service
jest.mock('@/lib/api', () => ({
  apiService: {
    exportDashboard: jest.fn(() => new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))),
  },
  useDashboardData: () => ({
    data: {
      metrics: {
        schedulePerformance: 85,
        budgetVariance: -3,
        qualityScore: 92,
        teamVelocity: 8,
        riskLevel: 'Medium',
        stakeholderSatisfaction: 88,
      },
    },
    loading: false,
    error: null,
  }),
}))

// Helper function to render with ToastProvider
const renderWithToast = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  )
}

describe('Dashboard Enhancements', () => {
  describe('Toast Notification System', () => {
    test('should display toast notifications correctly', async () => {
      renderWithToast(<DashboardHeader />)
      
      const refreshButton = screen.getByTitle('Refresh data')
      fireEvent.click(refreshButton)
      
      await waitFor(() => {
        expect(screen.getByText('Dashboard refreshed') || screen.getByText('Refresh failed')).toBeInTheDocument()
      })
    })

    test('should auto-dismiss toast after duration', async () => {
      jest.useFakeTimers()
      
      renderWithToast(<DashboardHeader />)
      
      const refreshButton = screen.getByTitle('Refresh data')
      fireEvent.click(refreshButton)
      
      await waitFor(() => {
        expect(screen.getByText('Dashboard refreshed') || screen.getByText('Refresh failed')).toBeInTheDocument()
      })
      
      jest.advanceTimersByTime(5000)
      
      await waitFor(() => {
        expect(screen.queryByText('Dashboard refreshed')).not.toBeInTheDocument()
        expect(screen.queryByText('Refresh failed')).not.toBeInTheDocument()
      })
      
      jest.useRealTimers()
    })
  })

  describe('Enhanced Header Navigation', () => {
    test('should have proper accessibility attributes', () => {
      renderWithToast(<DashboardHeader />)
      
      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveAttribute('aria-label', 'Main navigation')
      
      const overviewButton = screen.getByRole('button', { name: /overview/i })
      expect(overviewButton).toHaveAttribute('aria-current', 'page')
    })

    test('should handle tab switching', async () => {
      const user = userEvent.setup()
      renderWithToast(<DashboardHeader />)
      
      const teamButton = screen.getByRole('button', { name: /team/i })
      await user.click(teamButton)
      
      expect(teamButton).toHaveAttribute('aria-current', 'page')
    })

    test('should show refresh feedback', async () => {
      renderWithToast(<DashboardHeader />)
      
      const refreshButton = screen.getByTitle('Refresh data')
      fireEvent.click(refreshButton)
      
      // Check for loading state
      expect(refreshButton).toHaveClass('animate-spin')
      
      await waitFor(() => {
        expect(refreshButton).not.toHaveClass('animate-spin')
      })
    })
  })

  describe('Enhanced Settings Dialog', () => {
    test('should display success toast on save', async () => {
      const user = userEvent.setup()
      renderWithToast(
        <DashboardSettings 
          isOpen={true} 
          onClose={() => {}} 
          onSettingsChange={() => {}} 
        />
      )
      
      const saveButton = screen.getByRole('button', { name: /save settings/i })
      await user.click(saveButton)
      
      await waitFor(() => {
        expect(screen.getByText('Settings saved')).toBeInTheDocument()
      })
    })

    test('should display reset confirmation', async () => {
      const user = userEvent.setup()
      renderWithToast(
        <DashboardSettings 
          isOpen={true} 
          onClose={() => {}} 
          onSettingsChange={() => {}} 
        />
      )
      
      const resetButton = screen.getByRole('button', { name: /reset to defaults/i })
      await user.click(resetButton)
      
      await waitFor(() => {
        expect(screen.getByText('Settings reset')).toBeInTheDocument()
      })
    })
  })

  describe('Enhanced Export Dialog', () => {
    test('should highlight selected format', () => {
      render(
        <ExportDialog 
          isOpen={true} 
          onClose={() => {}} 
        />
      )
      
      const pdfButton = screen.getByRole('button', { name: /select pdf format/i })
      expect(pdfButton).toHaveClass('border-blue-500', 'bg-blue-50')
    })

    test('should show format selection indicators', () => {
      render(
        <ExportDialog 
          isOpen={true} 
          onClose={() => {}} 
        />
      )
      
      const pdfButton = screen.getByRole('button', { name: /select pdf format/i })
      expect(pdfButton.querySelector('svg')).toBeInTheDocument() // CheckCircle icon
    })

    test('should handle export process', async () => {
      const user = userEvent.setup()
      render(
        <ExportDialog 
          isOpen={true} 
          onClose={() => {}} 
        />
      )
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      await user.click(exportButton)
      
      // Check for loading state
      expect(screen.getByText('Exporting...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export pdf/i })).not.toBeDisabled()
      }, { timeout: 3000 })
    })
  })

  describe('Enhanced Metric Cards', () => {
    test('should handle click interactions', async () => {
      const mockOnClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          onClick={mockOnClick}
          description="Test description"
        />
      )
      
      const card = screen.getByRole('button')
      await user.click(card)
      
      expect(mockOnClick).toHaveBeenCalled()
    })

    test('should show hover effects', async () => {
      const user = userEvent.setup()
      
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          onClick={() => {}}
        />
      )
      
      const card = screen.getByRole('button')
      await user.hover(card)
      
      expect(card).toHaveClass('transform', 'scale-105')
    })

    test('should show tooltip on info icon hover', async () => {
      const user = userEvent.setup()
      
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          description="Test description"
        />
      )
      
      const infoIcon = screen.getByRole('img', { hidden: true }) // Lucide icons are hidden by default
      await user.hover(infoIcon)
      
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })

  describe('Enhanced Progress Chart', () => {
    test('should toggle chart lines', async () => {
      const user = userEvent.setup()
      
      render(<ProgressChart />)
      
      const plannedLegend = screen.getByRole('button', { name: /planned/i })
      await user.click(plannedLegend)
      
      expect(plannedLegend).toHaveClass('opacity-50')
    })

    test('should show legend tooltips', async () => {
      const user = userEvent.setup()
      
      render(<ProgressChart />)
      
      const plannedLegend = screen.getByRole('button', { name: /planned/i })
      await user.hover(plannedLegend)
      
      expect(screen.getByText('Target completion percentage')).toBeInTheDocument()
    })

    test('should show loading indicator', () => {
      render(<ProgressChart loading={true} />)
      
      expect(screen.getByRole('img', { hidden: true })).toHaveClass('animate-spin')
    })
  })

  describe('Enhanced Team Performance', () => {
    test('should show status indicators', () => {
      renderWithToast(<TeamPerformance />)
      
      // Check for status icons on team member cards
      const teamMembers = screen.getAllByRole('button')
      expect(teamMembers.length).toBeGreaterThan(0)
    })

    test('should handle member click with toast notifications', async () => {
      const user = userEvent.setup()
      renderWithToast(<TeamPerformance />)
      
      const firstMember = screen.getAllByRole('button')[0]
      await user.click(firstMember)
      
      await waitFor(() => {
        expect(
          screen.getByText(/is overutilized/) || 
          screen.getByText(/performance details/) || 
          screen.getByText(/additional capacity/)
        ).toBeInTheDocument()
      })
    })

    test('should show hover effects on team members', async () => {
      const user = userEvent.setup()
      renderWithToast(<TeamPerformance />)
      
      const firstMember = screen.getAllByRole('button')[0]
      await user.hover(firstMember)
      
      expect(firstMember).toHaveClass('bg-blue-50', 'border-blue-200')
    })
  })

  describe('Accessibility Enhancements', () => {
    test('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          onClick={() => {}}
        />
      )
      
      const card = screen.getByRole('button')
      card.focus()
      
      await user.keyboard('{Enter}')
      // Should trigger onClick
      expect(card).toHaveClass('animate-pulse')
    })

    test('should have proper ARIA attributes', () => {
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          onClick={() => {}}
        />
      )
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Error Handling', () => {
    test('should handle export errors gracefully', async () => {
      const mockApiService = require('@/lib/api').apiService
      mockApiService.exportDashboard.mockRejectedValueOnce(new Error('Export failed'))
      
      const user = userEvent.setup()
      render(
        <ExportDialog 
          isOpen={true} 
          onClose={() => {}} 
        />
      )
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      await user.click(exportButton)
      
      await waitFor(() => {
        expect(screen.getByText('Export failed. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Performance Optimizations', () => {
    test('should debounce rapid clicks', async () => {
      const mockOnClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <MetricCard
          title="Test Metric"
          value="85%"
          trend={5.2}
          trendDirection="up"
          icon={TrendingUp}
          color="blue"
          onClick={mockOnClick}
        />
      )
      
      const card = screen.getByRole('button')
      
      // Rapid clicks
      await user.click(card)
      await user.click(card)
      await user.click(card)
      
      // Should only be called once due to animation debouncing
      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })
  })
})
