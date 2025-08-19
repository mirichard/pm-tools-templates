'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

// Notification system types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 means permanent
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number; // 0-100 for progress indicators
}

// Micro-interaction types
export type MicroInteractionType = 'pulse' | 'bounce' | 'shake' | 'glow' | 'scale' | 'rotate';

interface FeedbackContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  triggerMicroInteraction: (element: HTMLElement, type: MicroInteractionType) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

interface FeedbackProviderProps {
  children: ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
}

export function FeedbackProvider({ 
  children, 
  position = 'top-right',
  maxNotifications = 5 
}: FeedbackProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.type === 'error' ? 8000 : 5000),
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    // Auto-remove after duration (unless permanent)
    if (newNotification.duration && newNotification.duration > 0) {
      const timeout = setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
      
      timeoutRefs.current.set(id, timeout);
    }

    return id;
  }, [maxNotifications]);

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Clear timeout if exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
  }, []);

  const triggerMicroInteraction = useCallback((element: HTMLElement, type: MicroInteractionType) => {
    const animations = {
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      shake: 'animate-shake',
      glow: 'animate-glow',
      scale: 'animate-scale',
      rotate: 'animate-spin',
    };

    const animationClass = animations[type];
    element.classList.add(animationClass);

    // Remove animation class after completion
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 1000);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const value: FeedbackContextType = {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    clearAllNotifications,
    triggerMicroInteraction,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <NotificationContainer position={position} />
    </FeedbackContext.Provider>
  );
}

// Notification container component
interface NotificationContainerProps {
  position: NotificationPosition;
}

function NotificationContainer({ position }: NotificationContainerProps) {
  const { notifications } = useFeedback();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={cn(
      'fixed z-50 space-y-2 pointer-events-none',
      positionClasses[position]
    )}>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

// Individual notification card
interface NotificationCardProps {
  notification: Notification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const { removeNotification, triggerMicroInteraction } = useFeedback();
  const cardRef = useRef<HTMLDivElement>(null);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'loading':
        return <Loader className="w-5 h-5 animate-spin" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseClasses = 'border-l-4';
    switch (notification.type) {
      case 'success':
        return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200`;
      case 'loading':
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200`;
    }
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      if (cardRef.current) {
        triggerMicroInteraction(cardRef.current, 'pulse');
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto',
        'transform transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:scale-105',
        getStyles()
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {notification.title}
            </p>
            {notification.message && (
              <p className="mt-1 text-sm opacity-90">
                {notification.message}
              </p>
            )}
            
            {/* Progress bar for loading states */}
            {notification.type === 'loading' && typeof notification.progress === 'number' && (
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${notification.progress}%` }}
                />
              </div>
            )}
            
            {/* Action button */}
            {notification.action && (
              <div className="mt-3">
                <button
                  onClick={handleAction}
                  className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-sm"
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => removeNotification(notification.id)}
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-sm transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility hooks for common feedback patterns
export function useLoadingState() {
  const { addNotification, updateNotification, removeNotification } = useFeedback();
  
  const startLoading = useCallback((title: string, message?: string) => {
    return addNotification({
      type: 'loading',
      title,
      message,
      duration: 0, // Permanent until manually removed
      progress: 0,
    });
  }, [addNotification]);
  
  const updateProgress = useCallback((id: string, progress: number) => {
    updateNotification(id, { progress });
  }, [updateNotification]);
  
  const completeLoading = useCallback((id: string, successTitle: string, successMessage?: string) => {
    removeNotification(id);
    return addNotification({
      type: 'success',
      title: successTitle,
      message: successMessage,
    });
  }, [addNotification, removeNotification]);
  
  const failLoading = useCallback((id: string, errorTitle: string, errorMessage?: string) => {
    removeNotification(id);
    return addNotification({
      type: 'error',
      title: errorTitle,
      message: errorMessage,
    });
  }, [addNotification, removeNotification]);
  
  return {
    startLoading,
    updateProgress,
    completeLoading,
    failLoading,
  };
}

// Micro-interaction component wrapper
interface MicroInteractionWrapperProps {
  children: ReactNode;
  trigger?: MicroInteractionType;
  className?: string;
}

export function MicroInteractionWrapper({ 
  children, 
  trigger = 'pulse', 
  className = '' 
}: MicroInteractionWrapperProps) {
  const { triggerMicroInteraction } = useFeedback();
  const elementRef = useRef<HTMLDivElement>(null);
  
  const handleClick = () => {
    if (elementRef.current) {
      triggerMicroInteraction(elementRef.current, trigger);
    }
  };
  
  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </div>
  );
}

// Success feedback component
interface SuccessFeedbackProps {
  title: string;
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function SuccessFeedback({ title, message, onAction, actionLabel }: SuccessFeedbackProps) {
  const { addNotification } = useFeedback();
  
  useEffect(() => {
    addNotification({
      type: 'success',
      title,
      message,
      action: onAction && actionLabel ? { label: actionLabel, onClick: onAction } : undefined,
    });
  }, [addNotification, title, message, onAction, actionLabel]);
  
  return null;
}
