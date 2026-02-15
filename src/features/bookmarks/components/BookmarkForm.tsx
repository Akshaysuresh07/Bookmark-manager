'use client'

import { useState } from 'react'

interface BookmarkFormProps {
    onAdd: (title: string, url: string) => Promise<void>
}

export default function BookmarkForm({ onAdd }: BookmarkFormProps) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        try {
            await onAdd(title, url)
            setTitle('')
            setUrl('')
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Supabase Docs"
                        required
                        className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">URL</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://supabase.com"
                        required
                        className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                    </span>
                ) : 'Save Bookmark'}
            </button>
        </form>
    )
}
