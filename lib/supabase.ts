import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side client for server actions and server components
export async function createServerSupabaseClient() {
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
                        // Ignore errors in read-only contexts
                    }
                },
            },
            global: {
                headers: {
                    'Connection': 'keep-alive',
                },
            },
            db: {
                schema: 'public',
            },
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    )
}

// Server-side client with service role key for admin operations
export async function createServerSupabaseAdminClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
                        // Ignore errors in read-only contexts
                    }
                },
            },
            global: {
                headers: {
                    'Connection': 'keep-alive',
                },
            },
            db: {
                schema: 'public',
            },
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    )
}

// Browser client for client components
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
