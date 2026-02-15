import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key || url === 'YOUR_SUPABASE_URL') {
        return null as any
    }

    return createBrowserClient(url, key)
}
