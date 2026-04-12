'use client';

import { useEffect, useState } from 'react';

export default function MobileGate({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
      setChecked(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!checked) return null;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#1a1207] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎧</div>
          <h1 className="text-3xl font-bold text-[#d4a855] mb-4">
            G Putnam Music
          </h1>
          <div className="w-16 h-0.5 bg-[#d4a855]/40 mx-auto mb-6" />
          <p className="text-[#F5e6c8] text-lg mb-4">
            Desktop Experience Only
          </p>
          <p className="text-[#F5e6c8]/60 text-sm leading-relaxed">
            We are building something special. Our full streaming platform
            is currently optimized for desktop browsers.
          </p>
          <p className="text-[#F5e6c8]/60 text-sm mt-4 leading-relaxed">
            Open <span className="text-[#d4a855]">gputnammusic.com</span> on
            your laptop or desktop for the best experience.
          </p>
          <div className="mt-8 text-[#d4a855]/30 text-xs tracking-widest uppercase">
            Dream The Stream
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
