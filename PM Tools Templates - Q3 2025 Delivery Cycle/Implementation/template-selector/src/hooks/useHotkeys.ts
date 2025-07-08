import { useEffect } from 'react';

type Hotkey = string;
type Callback = (e: KeyboardEvent) => void;

const parseHotkey = (hotkey: string): { key: string; ctrl: boolean; meta: boolean } => {
  const parts = hotkey.toLowerCase().split('+');
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('cmd') || parts.includes('⌘'),
  };
};

export const useHotkeys = (hotkey: Hotkey, callback: Callback) => {
  useEffect(() => {
    const parsed = parseHotkey(hotkey);

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey;
      const meta = e.metaKey;

      if (
        key === parsed.key &&
        ctrl === parsed.ctrl &&
        meta === parsed.meta
      ) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey, callback]);
};
