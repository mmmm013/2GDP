'use client'

import { useState } from 'react'
import { Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export type KutFamily = 'K-KUT' | 'mini-KUT' | 'K-kUpId' | string

interface CommemoPreOrderProps {
  /** Which KUT family this item belongs to (K-KUT | mini-KUT | K-kUpId | future) */
  kutFamily: KutFamily
  /** Which DB table holds this item */
  itemTable: 'k_kut_assets' | 'pix_pck'
  /** UUID of the item */
  itemId: string
  /** Optional label override shown inside the button */
  label?: string
  /** Optional short description shown beneath the button */
  description?: string
  /** Supabase JWT for the authenticated user (from useSession / client auth) */
  accessToken?: string
  className?: string
}

type State = 'idle' | 'loading' | 'success' | 'already' | 'error'

/**
 * CommemoPreOrder — integrates directly into existing K-KUT / mini-KUT / K-kUpId pages.
 * Renders a pre-order button for any Commemorative KUT item.
 * Works across all 3 KUT families and is open-ended for future types.
 */
export default function CommemoPreOrder({
  kutFamily,
  itemTable,
  itemId,
  label,
  description,
  accessToken,
  className = '',
}: CommemoPreOrderProps) {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handlePreOrder = async () => {
    if (!accessToken) {
      setErrorMsg('Sign in to pre-order')
      setState('error')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/pre-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ kut_family: kutFamily, item_table: itemTable, item_id: itemId }),
      })

      if (res.ok) {
        const data = await res.json()
        // status=pending or ready means newly created; any 200 for existing
        setState(data?.status && data.status !== 'cancelled' ? 'success' : 'success')
      } else if (res.status === 409) {
        setState('already')
      } else {
        const err = await res.json().catch(() => ({}))
        setErrorMsg(err?.error ?? 'Pre-order failed')
        setState('error')
      }
    } catch {
      setErrorMsg('Network error — try again')
      setState('error')
    }
  }

  const familyBadge: Record<string, string> = {
    'K-KUT':    'bg-violet-900/60 text-violet-200',
    'mini-KUT': 'bg-sky-900/60   text-sky-200',
    'K-kUpId':  'bg-rose-900/60  text-rose-200',
  }
  const badgeClass = familyBadge[kutFamily] ?? 'bg-gray-800 text-gray-300'

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      {/* Family badge */}
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
        <Sparkles className="w-3 h-3" />
        Commemorative {kutFamily}
      </span>

      {/* Description */}
      {description && (
        <p className="text-xs text-white/50 max-w-xs">{description}</p>
      )}

      {/* Pre-order button */}
      {state === 'idle' || state === 'error' ? (
        <button
          onClick={handlePreOrder}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-gradient-to-r from-violet-600 to-pink-600
                     hover:from-violet-500 hover:to-pink-500
                     text-white text-sm font-semibold
                     transition-all duration-150 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          {label ?? 'Pre-Order Now'}
        </button>
      ) : state === 'loading' ? (
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-white/10 text-white/50 text-sm font-semibold cursor-not-allowed"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Reserving…
        </button>
      ) : state === 'success' ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                        bg-green-900/50 text-green-300 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Pre-Order Reserved!
        </div>
      ) : state === 'already' ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                        bg-sky-900/50 text-sky-300 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Already Reserved
        </div>
      ) : null}

      {/* Error message */}
      {state === 'error' && errorMsg && (
        <p className="inline-flex items-center gap-1 text-xs text-red-400">
          <XCircle className="w-3 h-3" />
          {errorMsg}
        </p>
      )}
    </div>
  )
}
