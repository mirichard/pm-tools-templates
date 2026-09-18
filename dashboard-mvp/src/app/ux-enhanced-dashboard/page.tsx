'use client'

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { 
  ResponsiveProvider, 
  ResponsiveGrid, 
  ResponsiveContainer, 
  useResponsive 
} from '@/components/design-system/responsive';
import { 
  FeedbackProvider, 
  useFeedback, 
  MicroInteractionWrapper 
} from '@/components/design-system/feedback';
import { 
  AccessibilityProvider, 
  AccessibleButton, 
  SkipNavigationLinks,
  AccessibleModal,
  AccessibilityPreferencesPanel 
} from '@/components/design-system/accessibility';
import { NavigationProvider } from '@/components/design-system/navigation';
import { 
  Users, 
  Calendar, 
  Target, 
  CheckCircle,
  Clock,
  Zap,
  Star,
  Award
} from 'lucide-react';

/**
 * Enhanced UX Dashboard showcasing comprehensive design system improvements:
 * 1. Responsive Design System - Adaptive layouts for all devices
 * 2. User Feedback Mechanisms - Rich notifications and micro-interactions
 * 3. Accessibility Enhancements - WCAG compliance and screen reader support
 * 4. Navigation Patterns - Intuitive and keyboard-friendly navigation
 * 5. Performance Optimizations - Smooth animations and efficient rendering
 */

// Main dashboard content component
function DashboardContent() {
  const { isMobile, isTablet } = useResponsive();
  const { addNotification } = useFeedback();
  const [showAccessibilityPanel, setShowAccessibilityPanel] = React.useState(false);

  // Sample interaction handlers with feedback
  const handleMetricClick = (metricName: string) => {
    addNotification({
      type: 'info',
      title: `${metricName} Details`,
      message: 'Detailed view would open here in a real application',
      action: {
        label: 'View Report',
        onClick: () => {
          addNotification({
            type: 'success',
            title: 'Report Generated',
            message: 'Your detailed report is ready for download',
          });
        }
      }
    });
  };

  const handleQuickAction = (action: string) => {
    addNotification({
      type: 'loading',
      title: `Processing ${action}...`,
      message: 'Please wait while we complete this action',
      duration: 0,
      progress: 0
    });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress <= 100) {
        // Update progress would go here in real implementation
        console.log(`Progress: ${progress}%`);
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        addNotification({
          type: 'success',
          title: `${action} Completed`,
          message: 'Your action has been processed successfully',
        });
      }
    }, 500);
  };

  return (
    <ResponsiveContainer>
      <SkipNavigationLinks />
      
      {/* Page Header with responsive text sizing */}
      <div className="mb-8" id="main-content">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              UX Enhanced Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Comprehensive design system with responsive layouts, feedback mechanisms, and accessibility
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <AccessibleButton
              variant="secondary"
              size={isMobile ? 'sm' : 'md'}
              onClick={() => setShowAccessibilityPanel(true)}
            >
              Accessibility
            </AccessibleButton>
            
            <MicroInteractionWrapper trigger="scale">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{isMobile ? 'Live' : 'Real-time updates'}</span>
              </div>
            </MicroInteractionWrapper>
          </div>
        </div>
      </div>

      {/* Device Info Banner */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Current Layout: {isMobile ? '📱 Mobile' : isTablet ? '📱 Tablet' : '🖥️ Desktop'}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Responsive design adapts to your screen size automatically
            </p>
          </div>
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Critical Metrics - Responsive Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h2>
        <ResponsiveGrid
          cols={{ xs: 1, sm: 2, lg: 4 }}
          gap={{ xs: '1rem', md: '1.5rem' }}
        >
          <MicroInteractionWrapper trigger="pulse">
            <MetricCard
              title="User Engagement"
              value="94%"
              trend={12.5}
              trendDirection="up"
              icon={Users}
              color="green"
              priority="high"
              lastUpdated={new Date(Date.now() - 2 * 60000)}
              onClick={() => handleMetricClick('User Engagement')}
              description="Current user engagement rate shows excellent user satisfaction and system usability."
            />
          </MicroInteractionWrapper>
          
          <MicroInteractionWrapper trigger="bounce">
            <MetricCard
              title="Response Time"
              value="1.2s"
              trend={-15.3}
              trendDirection="down"
              icon={Zap}
              color="blue"
              priority="medium"
              lastUpdated={new Date(Date.now() - 5 * 60000)}
              onClick={() => handleMetricClick('Response Time')}
              description="Average system response time. Lower values indicate better performance."
            />
          </MicroInteractionWrapper>
          
          <MicroInteractionWrapper trigger="glow">
            <MetricCard
              title="Accessibility Score"
              value="98%"
              trend={8.2}
              trendDirection="up"
              icon={Award}
              color="purple"
              priority="low"
              lastUpdated={new Date(Date.now() - 1 * 60000)}
              onClick={() => handleMetricClick('Accessibility Score')}
              description="WCAG 2.1 AA compliance score showing excellent accessibility standards."
            />
          </MicroInteractionWrapper>
          
          <MicroInteractionWrapper trigger="scale">
            <MetricCard
              title="Mobile Usage"
              value="67%"
              trend={22.1}
              trendDirection="up"
              icon={Star}
              color="indigo"
              priority="medium"
              lastUpdated={new Date(Date.now() - 3 * 60000)}
              onClick={() => handleMetricClick('Mobile Usage')}
              description="Percentage of users accessing the dashboard from mobile devices."
            />
          </MicroInteractionWrapper>
        </ResponsiveGrid>
      </div>

      {/* Interactive Features Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Interactive Features
        </h2>
        <ResponsiveGrid
          cols={{ xs: 1, md: 2 }}
          gap={{ xs: '1rem', md: '1.5rem' }}
        >
          {/* Progress Chart */}
          <div className="order-1">
            <ProgressChart />
          </div>
          
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 order-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Export Data', urgency: 'high', icon: Target },
                { action: 'Generate Report', urgency: 'medium', icon: CheckCircle },
                { action: 'Schedule Review', urgency: 'low', icon: Calendar },
                { action: 'Update Settings', urgency: 'medium', icon: Clock }
              ].map((item, index) => (
                <MicroInteractionWrapper key={index} trigger="scale">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        item.urgency === 'high' ? 'bg-red-500' : 
                        item.urgency === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}></div>
                      <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.action}
                      </span>
                    </div>
                    <AccessibleButton
                      size="sm"
                      onClick={() => handleQuickAction(item.action)}
                      ariaLabel={`Execute ${item.action}`}
                    >
                      Execute
                    </AccessibleButton>
                  </div>
                </MicroInteractionWrapper>
              ))}
            </div>
          </div>
        </ResponsiveGrid>
      </div>

      {/* Feature Highlights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          UX Enhancements
        </h2>
        <ResponsiveGrid
          cols={{ xs: 1, sm: 2, lg: 3 }}
          gap={{ xs: '1rem', md: '1.5rem' }}
        >
          {[
            {
              title: 'Responsive Design',
              description: 'Adapts seamlessly to any screen size with optimized layouts',
              icon: '📱',
              features: ['Mobile-first approach', 'Flexible grid system', 'Adaptive typography']
            },
            {
              title: 'Rich Feedback',
              description: 'Instant user feedback with notifications and micro-interactions',
              icon: '✨',
              features: ['Toast notifications', 'Progress indicators', 'Micro-animations']
            },
            {
              title: 'Accessibility First',
              description: 'WCAG 2.1 AA compliant with screen reader support',
              icon: '♿',
              features: ['Keyboard navigation', 'Screen reader support', 'High contrast mode']
            }
          ].map((feature, index) => (
            <MicroInteractionWrapper key={index} trigger="glow">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MicroInteractionWrapper>
          ))}
        </ResponsiveGrid>
      </div>

      {/* Accessibility Settings Modal */}
      <AccessibleModal
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        title="Accessibility Settings"
        className="max-w-lg"
      >
        <AccessibilityPreferencesPanel />
        <div className="mt-6 flex justify-end gap-3">
          <AccessibleButton
            variant="secondary"
            onClick={() => setShowAccessibilityPanel(false)}
          >
            Cancel
          </AccessibleButton>
          <AccessibleButton
            onClick={() => {
              setShowAccessibilityPanel(false);
              addNotification({
                type: 'success',
                title: 'Settings Saved',
                message: 'Your accessibility preferences have been updated',
              });
            }}
          >
            Save Changes
          </AccessibleButton>
        </div>
      </AccessibleModal>
    </ResponsiveContainer>
  );
}

// Main page component with all providers
export default function UXEnhancedDashboardPage() {
  return (
    <AccessibilityProvider>
      <ResponsiveProvider>
        <FeedbackProvider position="top-right">
          <NavigationProvider>
            <DashboardLayout>
              <DashboardContent />
            </DashboardLayout>
          </NavigationProvider>
        </FeedbackProvider>
      </ResponsiveProvider>
    </AccessibilityProvider>
  );
}
