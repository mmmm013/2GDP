// components/CubModal.tsx
export default function CubModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-background border-2 border-primary p-8 max-w-md w-full relative">
        
        {/* Close X */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-primary hover:text-white font-mono text-xl"
        >
          [X]
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-primary mb-2 text-center uppercase">
          Become a CUB
        </h2>
        <p className="text-foreground text-center mb-6 text-sm opacity-80">
          Support the art. Join the pack. Get exclusive stems & streams.
        </p>

        {/* Tiers */}
        <div className="space-y-4">
          <button className="w-full p-4 border border-white/20 hover:border-primary hover:bg-primary/10 transition-all text-left group">
            <div className="font-bold text-primary group-hover:text-white">CUB SCOUT ($5/mo)</div>
            <div className="text-xs text-muted">Early access to tracks + Discord role.</div>
          </button>

          <button className="w-full p-4 border border-white/20 hover:border-primary hover:bg-primary/10 transition-all text-left group">
            <div className="font-bold text-primary group-hover:text-white">LION GUARD ($15/mo)</div>
            <div className="text-xs text-muted">Stems, downloads, and producer credits.</div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted">
          Powered by GPM KUBs Secure
        </div>
      </div>
    </div>
  );
}
