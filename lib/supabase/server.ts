import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Returns a Supabase client that reads the authenticated user session from
 * Next.js request cookies. Use this in Server Components, Route Handlers, and
 * Server Actions — never import the service-role client in public routes.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll is called by the Auth helpers inside Server Components
            // where cookies cannot be mutated; the error can be safely ignored
            // because the session is still readable.
          }
        },
      },
    }
  )
}
