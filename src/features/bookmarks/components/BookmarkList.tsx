'use client'

import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types'

interface BookmarkListProps {
    bookmarks: Bookmark[]
    loading: boolean
    onDelete: (id: string) => Promise<void>
}

export default function BookmarkList({
    bookmarks,
    loading,
    onDelete
}: BookmarkListProps) {
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        if (!supabase) return
        if (!confirm('Are you sure you want to delete this bookmark?')) return

        try {
            await onDelete(id)
        } catch (error: any) {
            alert(error.message)
        }
    }

    if (loading && bookmarks.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-slate-400 font-medium">Fetching your links...</p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookmarks.length === 0 ? (
                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">Your library is empty</p>
                    <p className="text-slate-400">Add some bookmarks to get started!</p>
                </div>
            ) : (
                bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-bold text-indigo-600">
                                        {bookmark.title.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(bookmark.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-lg font-bold text-slate-800 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                                    {bookmark.title}
                                </h3>
                                <div className="flex items-center text-sm text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.102 1.101" />
                                    </svg>
                                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                                </div>
                            </div>
                        </div>

                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center w-full py-3 px-4 bg-slate-50 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white font-bold rounded-2xl transition-all duration-300 text-sm"
                        >
                            Open Link
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                ))
            )}
        </div>
    )
}
