'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { emitAudioTelemetry } from '@/lib/audio/telemetry';

export default function TrafficBeacon() {
  const pathname = usePathname();
  const lastKeyRef = useRef<string>('');

  useEffect(() => {
    const key = pathname || '/';

    if (!key || key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    emitAudioTelemetry({
      event: 'page_view',
      source: 'web-pageview',
      url: key,
    });
  }, [pathname]);

  return null;
}
