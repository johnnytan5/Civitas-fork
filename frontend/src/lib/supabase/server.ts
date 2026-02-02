import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * Creates a Supabase client for Server Components and API Routes
 * Uses anon key with cookie-based session management
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Server component: cookies can only be read
            // Middleware will handle session refresh
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with service role key
 * BYPASSES ROW LEVEL SECURITY - Use only for privileged server-side operations
 *
 * Security: Service role key should NEVER be exposed to the client
 * Use cases:
 * - Creating database records on behalf of users
 * - Background sync operations
 * - Admin operations
 * - Blockchain sync that bypasses RLS
 */
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
