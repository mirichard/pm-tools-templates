'use client'

import React, { ReactNode } from 'react';
import { DashboardHeader } from './header';
import { ToastProvider } from '@/components/ui/toast';
import { useState } from 'react';
import { DashboardSettings, DashboardSettings as DashboardSettingsType } from './DashboardSettings';
import { ExportDialog } from './ExportDialog';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Enhanced Dashboard Layout following Donald Norman design principles:
 * 1. Visibility: Making important controls and information visible and prominent
 * 2. Feedback: Providing clear feedback for user actions
 * 3. Constraints: Limiting available actions to prevent errors
 * 4. Mapping: Creating intuitive relationships between controls and their effects
 * 5. Consistency: Maintaining uniform design patterns
 * 6. Affordances: Making it obvious how controls should be used
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [, setDashboardSettings] = useState<DashboardSettingsType | null>(null);

  // Handle settings changes - this provides clear feedback on user actions
  const handleSettingsChange = (settings: DashboardSettingsType) => {
    setDashboardSettings(settings);
    
    // Apply theme changes immediately for instant feedback
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme based on system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <DashboardHeader 
          onSettingsClick={() => setIsSettingsOpen(true)}
          onExportClick={() => setIsExportOpen(true)}
        />
        
        {/* Main Content Area with consistent spacing and visual hierarchy */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Accessibility landmark for better screen reader navigation */}
          <div role="region" aria-label="Dashboard Content" className="space-y-6">
            {children}
          </div>
        </main>
        
        {/* Status Footer - providing system status visibility */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                  <span>System Status: Operational</span>
                </div>
                <span>Last Updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Version: 1.0.0</span>
                <a 
                  href="#" 
                  className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    // Would typically link to documentation
                    alert('Documentation would open here');
                  }}
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </footer>
      
        {/* Modals - Constraining interactions to prevent errors */}
        <DashboardSettings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          onSettingsChange={handleSettingsChange}
        />
        
        <ExportDialog
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
