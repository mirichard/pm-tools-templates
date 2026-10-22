import { useMemo, useSyncExternalStore } from 'react';
import type { DashboardSettings } from '@/components/dashboard/DashboardSettings';

const subscribe = (notify: () => void) => {
  window.addEventListener('storage', notify);
  return () => window.removeEventListener('storage', notify);
};
const getSnapshot = () => {
  try { return localStorage.getItem('dashboardSettings'); }
  catch { return null; }
};

export function useSavedDashboardSettings(): DashboardSettings | null {
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return useMemo(() => {
    if (!saved) return null;
    try { return JSON.parse(saved); }
    catch { return null; }
  }, [saved]);
}
