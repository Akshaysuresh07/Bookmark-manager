import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types'

export const useBookmarks = (userId: string | undefined) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const fetchBookmarks = useCallback(async () => {
        if (!supabase || !userId) return
        setLoading(true)
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching bookmarks:', error)
        } else {
            setBookmarks(data || [])
        }
        setLoading(false)
    }, [supabase, userId])

    useEffect(() => {
        if (!supabase || !userId) return
        fetchBookmarks()

        const channel = supabase
            .channel('bookmarks-realtime-hook')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookmarks' },
                () => {
                    fetchBookmarks()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId, fetchBookmarks])

    const deleteBookmark = async (id: string) => {
        if (!supabase) return
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            throw error
        }
        await fetchBookmarks()
    }

    const addBookmark = async (title: string, url: string) => {
        if (!supabase || !userId) return
        const { error } = await supabase
            .from('bookmarks')
            .insert([{ title, url, user_id: userId }])

        if (error) {
            throw error
        }
        await fetchBookmarks()
    }

    return {
        bookmarks,
        loading,
        refresh: fetchBookmarks,
        deleteBookmark,
        addBookmark
    }
}
