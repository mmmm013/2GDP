'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function KUTRedirect({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleRedirect = async () => {
      const kutId = params.id
      
      // Parse KUT format: type-id-timestamp
      // Examples: sti-reflections-1738123456, bti-bestnights-1738123456, fp-valentines-1738123456
      const parts = kutId.split('-')
      
      if (parts.length < 2) {
        router.push('/kupid')
        return
      }
      
      const type = parts[0]
      const itemId = parts.slice(1, -1).join('-') // Reconstruct ID without timestamp
      
      // Route based on type
      switch(type) {
        case 'sti':
          // Song Track Item - redirect to /gift/songs with track parameter
          router.push(`/gift/songs?track=${itemId}`)
          break
          
        case 'bti':
          // Behind The Item - redirect to /gift/behind with track parameter
          router.push(`/gift/behind?track=${itemId}`)
          break
          
        case 'fp':
          // Featured Playlist - redirect to /gift/playlists with playlist parameter
          router.push(`/gift/playlists?playlist=${itemId}`)
          break
          
        default:
          // Unknown type, redirect to main Kupid page
          router.push('/kupid')
      }
    }
    
    handleRedirect()
  }, [params.id, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#3E2723' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#FFD95A' }}></div>
        <p className="mt-4 text-lg" style={{ color: '#F5E6D3' }}>Loading your KUT...</p>
      </div>
    </div>
  )
}
