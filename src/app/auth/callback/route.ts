import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    // Get the site URL from env or fallback to dynamic detection
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL

    if (!baseUrl) {
        // Dynamic detection if env is not set
        const protocol = request.headers.get('x-forwarded-proto') ?? 'http'
        const host = request.headers.get('host')
        baseUrl = `${protocol}://${host}`
    }

    // Clean up base URL (remove trailing slash)
    baseUrl = baseUrl.replace(/\/$/, '')

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
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
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${baseUrl}${next}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
