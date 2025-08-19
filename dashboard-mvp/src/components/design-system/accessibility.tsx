'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Accessibility preferences and types
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  screenReaderEnabled: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

export type FocusIndicatorStyle = 'ring' | 'outline' | 'shadow' | 'underline';
export type MotionPreference = 'no-preference' | 'reduce';

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  announceToScreenReader: (message: string) => void;
  setFocusVisible: (visible: boolean) => void;
  trapFocus: (container: HTMLElement) => () => void;
  isFocusVisible: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReaderEnabled: false,
    keyboardNavigation: true,
    focusVisible: true,
  });

  const [isFocusVisible, setIsFocusVisible] = useState(false);

  // Detect system preferences on mount
  useEffect(() => {
    const detectSystemPreferences = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      // Detect screen reader (basic detection)
      const screenReaderEnabled = window.navigator.userAgent.includes('NVDA') ||
                                  window.navigator.userAgent.includes('JAWS') ||
                                  window.speechSynthesis?.getVoices().length > 0;

      setPreferences(prev => ({
        ...prev,
        reducedMotion,
        highContrast,
        screenReaderEnabled,
      }));
    };

    detectSystemPreferences();

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Keyboard focus detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const updatePreferences = useCallback((updates: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    
    // Apply CSS custom properties for dynamic styling
    const root = document.documentElement;
    
    if (updates.fontSize) {
      const fontSizes = {
        small: '0.875rem',
        medium: '1rem',
        large: '1.125rem',
        xl: '1.25rem',
      };
      root.style.setProperty('--base-font-size', fontSizes[updates.fontSize]);
    }
    
    if (updates.highContrast !== undefined) {
      root.classList.toggle('high-contrast', updates.highContrast);
    }
    
    if (updates.reducedMotion !== undefined) {
      root.classList.toggle('reduced-motion', updates.reducedMotion);
    }
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const setFocusVisible = useCallback((visible: boolean) => {
    setIsFocusVisible(visible);
  }, []);

  // Focus trap utility for modals and dropdowns
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        container.dispatchEvent(new CustomEvent('escape'));
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value: AccessibilityContextType = {
    preferences,
    updatePreferences,
    announceToScreenReader,
    setFocusVisible,
    trapFocus,
    isFocusVisible,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  ariaLabel,
  className = '',
  disabled,
  ...props
}: AccessibleButtonProps) {
  const { preferences, isFocusVisible } = useAccessibility();

  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Size variants
    {
      'px-2 py-1 text-xs': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
    },
    // Variant styles
    {
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
    },
    // Accessibility enhancements
    {
      'ring-2 ring-offset-2': isFocusVisible && preferences.focusVisible,
      'transition-none': preferences.reducedMotion,
      'contrast-more:border contrast-more:border-current': preferences.highContrast,
    },
    // Disabled state
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
    },
    className
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// Skip navigation links
export function SkipNavigationLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-0 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Screen reader only content
interface ScreenReaderOnlyProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function ScreenReaderOnly({ children, as: Component = 'span' }: ScreenReaderOnlyProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

// Live region for announcements
export function LiveRegion({ children, priority = 'polite' }: { 
  children: ReactNode; 
  priority?: 'polite' | 'assertive'; 
}) {
  return (
    <div 
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Accessible modal component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function AccessibleModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}: AccessibleModalProps) {
  const { trapFocus, announceToScreenReader } = useAccessibility();
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      announceToScreenReader(`${title} dialog opened`);
      
      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current);
        return cleanup;
      }
    }
  }, [isOpen, trapFocus, announceToScreenReader, title]);

  useEffect(() => {
    const handleEscape = () => onClose();
    
    if (isOpen && modalRef.current) {
      modalRef.current.addEventListener('escape', handleEscape);
      return () => modalRef.current?.removeEventListener('escape', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        <div
          ref={modalRef}
          className={cn(
            'relative bg-white rounded-lg shadow-xl max-w-md w-full',
            'transform transition-all duration-200',
            className
          )}
        >
          <div className="p-6">
            <h2 id="modal-title" className="text-lg font-semibold mb-4">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessibility preferences panel
export function AccessibilityPreferencesPanel() {
  const { preferences, updatePreferences } = useAccessibility();

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold">Accessibility Preferences</h3>
      
      <div className="space-y-4">
        {/* Font size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <select
            value={preferences.fontSize}
            onChange={(e) => updatePreferences({ 
              fontSize: e.target.value as AccessibilityPreferences['fontSize'] 
            })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        {/* High contrast */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(e) => updatePreferences({ highContrast: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">High Contrast Mode</span>
          </label>
        </div>

        {/* Reduced motion */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Reduce Motion</span>
          </label>
        </div>

        {/* Keyboard navigation */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.keyboardNavigation}
              onChange={(e) => updatePreferences({ keyboardNavigation: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Enhanced Keyboard Navigation</span>
          </label>
        </div>
      </div>
    </div>
  );
}
