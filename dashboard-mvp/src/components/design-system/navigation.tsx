'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BarChart3, Users, Calendar, Settings, HelpCircle } from 'lucide-react';

// Define navigation structure and types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
  isExternal?: boolean;
  ariaLabel?: string;
  isBeta?: boolean;
}

export const primaryNavigation: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: Home, ariaLabel: 'Go to dashboard home' },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '#', // Parent item
    icon: BarChart3,
    ariaLabel: 'Analytics section',
    children: [
      { id: 'overview', label: 'Overview', href: '/analytics/overview', icon: BarChart3 },
      { id: 'reports', label: 'Reports', href: '/analytics/reports', icon: BarChart3, isBeta: true },
      { id: 'dashboards', label: 'Dashboards', href: '/analytics/dashboards', icon: BarChart3 },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    href: '#',
    icon: Users,
    ariaLabel: 'Management section',
    children: [
      { id: 'projects', label: 'Projects', href: '/management/projects', icon: Users },
      { id: 'teams', label: 'Teams', href: '/management/teams', icon: Users },
      { id: 'tasks', label: 'Tasks', href: '/management/tasks', icon: Users },
    ],
  },
  { id: 'timeline', label: 'Timeline', href: '/timeline', icon: Calendar, ariaLabel: 'View project timeline' },
];

export const secondaryNavigation: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    ariaLabel: 'Open application settings',
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: 'https://support.example.com',
    icon: HelpCircle,
    isExternal: true,
    ariaLabel: 'Visit help and support page (opens in new tab)',
  },
];

interface NavigationContextType {
  activeItem: string | null;
  setActiveItem: (id: string) => void;
  navigate: (href: string, isExternal?: boolean) => void;
  isSubmenuOpen: (id: string) => boolean;
  toggleSubmenu: (id: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Determine active item based on current route
  useEffect(() => {
    const findActive = (items: NavItem[]): string | null => {
      for (const item of items) {
        if (item.href === pathname) return item.id;
        if (item.children) {
          const activeChild = findActive(item.children);
          if (activeChild) return item.id;
        }
      }
      return null;
    };
    
    setActiveItem(findActive(primaryNavigation));
  }, [pathname]);

  // Programmatic navigation for accessibility and consistency
  const navigate = useCallback((href: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  }, [router]);
  
  // Handle submenu state for better user control
  const toggleSubmenu = useCallback((id: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const isSubmenuOpen = (id: string) => openSubmenus.has(id);

  const value: NavigationContextType = {
    activeItem,
    setActiveItem,
    navigate,
    isSubmenuOpen,
    toggleSubmenu,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

