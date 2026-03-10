import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Shared retry logic for all Supabase API calls globally
async function fetchWithRetry(url: RequestInfo | URL, options?: RequestInit, maxRetries = 3, delay = 1000) {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const fetchOptions = {
                ...options,
                signal: options?.signal || AbortSignal.timeout(30000), // Enforce 30s timeout on all fetches
            }
            return await fetch(url, fetchOptions);
        } catch (error) {
            lastError = error;
            console.warn(`[Supabase Fetch] Attempt ${i + 1} failed: ${error instanceof Error ? error.message : String(error)}. Retrying in ${delay * (i + 1)}ms...`);
            
            if (error instanceof Error && error.name === 'AbortError') {
                throw error; // Don't retry user cancellations
            }
            
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
    throw lastError || new Error('Max retries exceeded');
}

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
                fetch: fetchWithRetry
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
                fetch: fetchWithRetry
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
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: fetchWithRetry
            }
        }
    )
}
