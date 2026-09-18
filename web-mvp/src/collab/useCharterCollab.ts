import * as React from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Experimental: synchronize Project Charter form data using Yjs Map under key 'data'
export function useCharterCollab(enabled: boolean) {
  const [doc, setDoc] = React.useState<Y.Doc | null>(null);
  const [map, setMap] = React.useState<Y.Map<any> | null>(null);

  React.useEffect(() => {
    if (!enabled) { setDoc(null); setMap(null); return; }
    const d = new Y.Doc();
    const room = 'pmtools-charter';
    const provider = new WebsocketProvider('ws://localhost:1234', room, d, { connect: true });
    const m = d.getMap<any>('data');
    setDoc(d); setMap(m);
    return () => { provider.disconnect(); d.destroy(); };
  }, [enabled]);

  return { ydoc: doc, ymap: map } as const;
}
