'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Responsive breakpoint system
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveContextType {
  currentBreakpoint: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

interface ResponsiveProviderProps {
  children: ReactNode;
}

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentBreakpoint = (width: number): ScreenSize => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const currentBreakpoint = getCurrentBreakpoint(screenWidth);
  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
  const isTablet = currentBreakpoint === 'md';
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl';

  const value: ResponsiveContextType = {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

// Utility hook for responsive values
export function useResponsiveValue<T>(values: Partial<Record<ScreenSize, T>>): T | undefined {
  const { currentBreakpoint } = useResponsive();
  
  // Find the appropriate value, falling back to smaller breakpoints if needed
  const breakpointOrder: ScreenSize[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
}

// Responsive grid system
interface GridProps {
  children: ReactNode;
  cols?: Partial<Record<ScreenSize, number>>;
  gap?: Partial<Record<ScreenSize, string>>;
  className?: string;
}

export function ResponsiveGrid({ children, cols = { xs: 1, md: 2, lg: 3 }, gap = { xs: '1rem', md: '1.5rem' }, className = '' }: GridProps) {
  
  const currentCols = useResponsiveValue(cols) || 1;
  const currentGap = useResponsiveValue(gap) || '1rem';
  
  return (
    <div 
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
        gap: currentGap,
      }}
    >
      {children}
    </div>
  );
}

// Responsive container component
interface ContainerProps {
  children: ReactNode;
  maxWidth?: Partial<Record<ScreenSize, string>>;
  padding?: Partial<Record<ScreenSize, string>>;
  className?: string;
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = { xs: '100%', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  padding = { xs: '1rem', sm: '1.5rem', md: '2rem' },
  className = ''
}: ContainerProps) {
  const currentMaxWidth = useResponsiveValue(maxWidth) || '100%';
  const currentPadding = useResponsiveValue(padding) || '1rem';
  
  return (
    <div 
      className={`mx-auto ${className}`}
      style={{
        maxWidth: currentMaxWidth,
        padding: `0 ${currentPadding}`,
      }}
    >
      {children}
    </div>
  );
}

// Hook for responsive behavior
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Responsive text sizing utility
interface ResponsiveTextProps {
  children: ReactNode;
  size?: Partial<Record<ScreenSize, string>>;
  className?: string;
}

export function ResponsiveText({ 
  children, 
  size = { xs: '0.875rem', md: '1rem', lg: '1.125rem' },
  className = ''
}: ResponsiveTextProps) {
  const currentSize = useResponsiveValue(size) || '1rem';
  
  return (
    <span 
      className={className}
      style={{ fontSize: currentSize }}
    >
      {children}
    </span>
  );
}
