'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// /mkut — no ID provided → redirect to K-KUT creator
export default function MkutIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/kkut/create')
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-950 flex items-center justify-center">
      <p className="text-white/40 text-sm animate-pulse">Loading K-KUT Creator…</p>
    </main>
  )
}
