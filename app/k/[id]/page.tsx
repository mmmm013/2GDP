'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type RouteTarget = {
  href: string
  label: string
}

// A K-KUT short code is 4-10 alphanumeric chars with no hyphens.
const isShortCode = (id: string): boolean => /^[a-z0-9]{4,10}$/i.test(id)

type OpenMode = 'kkut' | 'mkut' | 'jewelry'

const isJewelrySignal = (id: string, queryMode: string | null): boolean => {
  if (queryMode === 'jewelry' || queryMode === 'jlr') return true
  const normalized = id.toLowerCase()
  return (
    normalized.startsWith('jlr-') ||
    normalized.startsWith('charm-') ||
    normalized.startsWith('locket-')
  )
}

const isMiniKutSignal = (id: string, queryMk: string | null): boolean => {
  if (queryMk === '1' || queryMk === 'true' || queryMk === 'mkut') return true
  const normalized = id.toLowerCase()
  return (
    normalized.startsWith('mk-') ||
    normalized.startsWith('mkut-') ||
    normalized.startsWith('m-kut-') ||
    normalized.startsWith('mini-')
  )
}

const resolveRoute = (kutId: string): RouteTarget => {
  const rawParts = kutId.split('-').filter(Boolean)
  const parts = [...rawParts]

  // Strip jewelry wrappers (jlr-, charm-, locket-)
  if (parts[0] === 'jlr' || parts[0] === 'charm' || parts[0] === 'locket') {
    parts.shift()
  }

  // Support mKUT wrappers while preserving existing type routing.
  if (parts[0] === 'mk' || parts[0] === 'mkut' || (parts[0] === 'm' && parts[1] === 'kut')) {
    parts.shift()
    if (parts[0] === 'kut') parts.shift()
  }

  if (parts.length < 2) {
    return { href: '/kupid', label: 'KUPID' }
  }

  const type = parts[0]
  const itemId = parts.slice(1, -1).join('-')

  switch (type) {
    case 'sti':
      return { href: `/gift/songs?track=${itemId}`, label: 'SONG' }
    case 'bti':
      return { href: `/gift/behind?track=${itemId}`, label: 'STORY' }
    case 'fp':
      return { href: `/gift/playlists?playlist=${itemId}`, label: 'PLAYLIST' }
    default:
      return { href: '/kupid', label: 'KUPID' }
  }
}

export default function KUTRedirect({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [resolvedTarget, setResolvedTarget] = useState<RouteTarget | null>(null)

  const mode = useMemo<OpenMode>(() => {
    if (isJewelrySignal(params.id, searchParams.get('mode'))) return 'jewelry'
    if (isMiniKutSignal(params.id, searchParams.get('mk'))) return 'mkut'
    return 'kkut'
  }, [params.id, searchParams])

  // --- Resolve destination (async for K-KUT short codes) ---
  useEffect(() => {
    const id = params.id

    // 1. Canonical mKUT ID → mKUT player
    if (id.toLowerCase().startsWith('mkut-')) {
      setResolvedTarget({ href: `/mkut/${id}`, label: 'MINI PLAYER' })
      return
    }

    // 2. K-KUT short code → look up in DB via API
    if (isShortCode(id)) {
      fetch(`/api/k/resolve/${encodeURIComponent(id)}`)
        .then(async r => {
          if (!r.ok) throw new Error('not found')
          return r.json()
        })
        .then((data: { destination: string; item_type: string }) => {
          const labels: Record<string, string> = { STI: 'SONG', BTI: 'STORY', FP: 'PLAYLIST' }
          setResolvedTarget({ href: data.destination, label: labels[data.item_type] ?? 'KUPID' })
        })
        .catch(() => {
          setResolvedTarget({ href: '/kupid', label: 'KUPID' })
        })
      return
    }

    // 3. Semantic IDs (sti-…, bti-…, fp-…) — synchronous resolve
    setResolvedTarget(resolveRoute(id))
  }, [params.id])

  // --- Navigate once target is resolved + delay expires ---
  useEffect(() => {
    if (!resolvedTarget) return
    const delayMs = mode === 'mkut' ? 1100 : mode === 'jewelry' ? 2000 : 1650
    const timer = window.setTimeout(() => {
      setIsNavigating(true)
      router.push(resolvedTarget.href)
    }, delayMs)
    return () => window.clearTimeout(timer)
  }, [resolvedTarget, mode, router])

  if (mode === 'jewelry') {
    return (
      <div className="jlr-shell min-h-screen flex items-center justify-center px-6">
        <div className="jlr-card max-w-sm w-full rounded-3xl p-8 text-center">
          <div className="locket-wrap" aria-hidden="true">
            <div className="locket-chain" />
            <div className="locket-body">
              <div className="locket-half locket-left" />
              <div className="locket-half locket-right" />
              <div className="locket-glow">
                <span className="locket-note">♪</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[10px] tracking-[0.45em] font-semibold text-[#C8A882] uppercase">G Putnam Music</p>
          <h1 className="mt-2 text-2xl font-black text-[#f5e6d0] tracking-tight">
            {isNavigating ? 'Opening your gift…' : 'For You'}
          </h1>
          <p className="mt-3 text-sm text-[#d9c3a0] italic">A moment of music, sealed in gold.</p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#b08d6a]">
            {isNavigating ? `Entering ${resolvedTarget?.label ?? '…'}` : 'Your capsule is opening'}
          </p>
        </div>

        <style jsx>{`
          .jlr-shell {
            background:
              radial-gradient(700px 360px at 50% -5%, rgba(200, 168, 130, 0.18), transparent 60%),
              linear-gradient(150deg, #1a0f0a 0%, #0f0a06 55%, #1c1108 100%);
          }
          .jlr-card {
            background: rgba(18, 10, 6, 0.82);
            border: 1px solid rgba(200, 168, 130, 0.28);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(200, 168, 130, 0.1);
          }
          .locket-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 4px;
          }
          .locket-chain {
            width: 2px;
            height: 28px;
            background: linear-gradient(180deg, transparent, #C8A882 60%, #a87c4e);
            border-radius: 1px;
          }
          .locket-body {
            position: relative;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 1.5px solid rgba(200, 168, 130, 0.5);
            overflow: hidden;
            box-shadow: 0 0 18px rgba(200, 168, 130, 0.22), inset 0 1px 0 rgba(255, 244, 224, 0.12);
          }
          .locket-half {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(135deg, #6b4423 0%, #3d2417 60%, #2a1810 100%);
          }
          .locket-left {
            left: 0;
            transform-origin: right center;
            border-radius: 999px 0 0 999px;
            animation: locket-open-left 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .locket-right {
            right: 0;
            transform-origin: left center;
            border-radius: 0 999px 999px 0;
            animation: locket-open-right 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .locket-glow {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle, rgba(200, 168, 130, 0.35) 0%, transparent 70%);
            animation: locket-glow-in 1.5s ease-out forwards;
            opacity: 0;
          }
          .locket-note {
            font-size: 1.5rem;
            color: #f5e0c0;
            text-shadow: 0 0 8px rgba(200, 168, 130, 0.8);
            animation: note-rise 1.6s ease-out 0.4s forwards;
            opacity: 0;
          }
          @keyframes locket-open-left {
            0%   { transform: perspective(180px) rotateY(0deg); }
            35%  { transform: perspective(180px) rotateY(-5deg); }
            100% { transform: perspective(180px) rotateY(-88deg); }
          }
          @keyframes locket-open-right {
            0%   { transform: perspective(180px) rotateY(0deg); }
            35%  { transform: perspective(180px) rotateY(5deg); }
            100% { transform: perspective(180px) rotateY(88deg); }
          }
          @keyframes locket-glow-in {
            0%   { opacity: 0; }
            50%  { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes note-rise {
            0%   { opacity: 0; transform: translateY(6px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
        `}</style>
      </div>
    )
  }

  if (mode === 'mkut') {
    return (
      <div className="mkut-shell min-h-screen flex items-center justify-center px-6">
        <div className="mkut-card max-w-md w-full rounded-2xl p-6 text-center">
          <div className="orbits" aria-hidden="true">
            <span className="planet planet-a" />
            <span className="planet planet-b" />
            <span className="planet planet-c" />
          </div>
          <div className="leaf-wrap" aria-hidden="true">
            <span className="leaf leaf-a" />
            <span className="leaf leaf-b" />
            <span className="leaf leaf-c" />
          </div>
          <p className="text-xs tracking-[0.35em] font-bold text-[#1f4d3a] uppercase">mKUT</p>
          <h1 className="mt-2 text-2xl font-black text-[#1d2d4a] uppercase tracking-tight">Mini Moment</h1>
          <p className="mt-3 text-sm text-[#28445f]">Universe spark. Nature breath. Opening now.</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-[#2b5a46]">
            {isNavigating ? `Entering ${resolvedTarget?.label ?? '…'}` : 'Preparing stream'}
          </p>
        </div>

        <style jsx>{`
          .mkut-shell {
            background:
              radial-gradient(1200px 500px at 50% -10%, rgba(73, 129, 194, 0.35), transparent 60%),
              linear-gradient(160deg, #eaf4ff 0%, #def5e8 55%, #f1eadb 100%);
          }
          .mkut-card {
            background: rgba(255, 255, 255, 0.78);
            border: 1px solid rgba(50, 93, 73, 0.2);
            backdrop-filter: blur(4px);
            box-shadow: 0 18px 45px rgba(17, 45, 32, 0.16);
          }
          .orbits {
            position: relative;
            height: 56px;
            margin-bottom: 10px;
          }
          .planet {
            position: absolute;
            border-radius: 999px;
            animation: drift 1.6s ease-in-out infinite;
          }
          .planet-a {
            width: 14px;
            height: 14px;
            left: 48%;
            top: 4px;
            background: #4469a8;
          }
          .planet-b {
            width: 10px;
            height: 10px;
            left: 28%;
            top: 24px;
            background: #5ea08b;
            animation-delay: 0.2s;
          }
          .planet-c {
            width: 8px;
            height: 8px;
            right: 30%;
            top: 30px;
            background: #7a5f3f;
            animation-delay: 0.35s;
          }
          .leaf-wrap {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 2px;
          }
          .leaf {
            width: 12px;
            height: 20px;
            border-radius: 12px 12px 2px 12px;
            background: linear-gradient(180deg, #6cb38d, #3b7c5b);
            transform-origin: bottom center;
            animation: sway 1.8s ease-in-out infinite;
          }
          .leaf-b {
            animation-delay: 0.15s;
          }
          .leaf-c {
            animation-delay: 0.3s;
          }
          @keyframes drift {
            0%,
            100% {
              transform: translateY(0px);
              opacity: 0.9;
            }
            50% {
              transform: translateY(-6px);
              opacity: 0.6;
            }
          }
          @keyframes sway {
            0%,
            100% {
              transform: rotate(-5deg);
            }
            50% {
              transform: rotate(7deg);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="kkut-shell min-h-screen flex items-center justify-center px-6">
      <div className="kkut-card max-w-md w-full rounded-2xl p-6 text-center">
        <div className="gpm-box" aria-hidden="true">
          <div className="panel panel-left">G</div>
          <div className="panel panel-front">P</div>
          <div className="panel panel-right">M</div>
        </div>

        <p className="mt-3 text-xs tracking-[0.35em] font-bold text-[#C8A882] uppercase">K-KUT</p>
        <h1 className="mt-2 text-2xl font-black text-[#F5E6D3] uppercase tracking-tight">GPM Signature Open</h1>
        <p className="mt-3 text-sm text-[#e7d4b6]">Delivering your special K-KUT experience.</p>
        <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-[#d9c3a0]">
          {isNavigating ? `Entering ${resolvedTarget?.label ?? '…'}` : 'Preparing reveal'}
        </p>
      </div>

      <style jsx>{`
        .kkut-shell {
          background:
            radial-gradient(900px 420px at 20% -20%, rgba(200, 168, 130, 0.22), transparent 65%),
            linear-gradient(145deg, #27160f 0%, #3d2417 48%, #4e2e1d 100%);
        }
        .kkut-card {
          background: rgba(28, 14, 9, 0.72);
          border: 1px solid rgba(200, 168, 130, 0.3);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.45);
        }
        .gpm-box {
          height: 124px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          align-items: end;
          margin: 0 auto;
          perspective: 700px;
        }
        .panel {
          border: 1px solid rgba(222, 190, 154, 0.48);
          border-radius: 10px;
          color: #f9e7cb;
          font-weight: 900;
          font-size: 2.3rem;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #8d5e3a 0%, #5d3a23 100%);
          box-shadow: inset 0 1px 0 rgba(255, 244, 224, 0.2);
        }
        .panel-left {
          height: 86px;
          transform-origin: top;
          animation: drop-left 1.25s ease-in-out infinite;
        }
        .panel-front {
          height: 106px;
          transform-origin: top;
          animation: drop-front 1.25s ease-in-out infinite;
          animation-delay: 0.1s;
        }
        .panel-right {
          height: 92px;
          transform-origin: top;
          animation: drop-right 1.25s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        @keyframes drop-left {
          0%,
          100% {
            transform: rotateX(0deg) translateY(0);
          }
          45% {
            transform: rotateX(75deg) translateY(8px);
          }
        }
        @keyframes drop-front {
          0%,
          100% {
            transform: rotateX(0deg) translateY(0);
          }
          45% {
            transform: rotateX(82deg) translateY(12px);
          }
        }
        @keyframes drop-right {
          0%,
          100% {
            transform: rotateX(0deg) translateY(0);
          }
          45% {
            transform: rotateX(76deg) translateY(9px);
          }
        }
      `}</style>
    </div>
  )
}
