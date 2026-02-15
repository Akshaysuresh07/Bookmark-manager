'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

// Feature Components
import LoginScreen from '@/features/auth/components/LoginScreen'
import BookmarkForm from '@/features/bookmarks/components/BookmarkForm'
import BookmarkList from '@/features/bookmarks/components/BookmarkList'

// Feature Hooks
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks'

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const supabase = createClient()
  const { bookmarks, loading: fetchingBookmarks, deleteBookmark, addBookmark } = useBookmarks(user?.id)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600"></div>
          <div className="mt-4 text-center font-bold text-slate-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans antialiased text-slate-900">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">BookmarkHub</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm overflow-hidden group"
            >
              <div className="text-lg font-black text-indigo-600 group-hover:scale-110 transition-transform">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-5 py-4 border-b border-slate-50">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors flex items-center space-x-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 space-y-16">
        <section className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-30 select-none"></div>
          <div className="relative">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Expand Library</h2>
            <p className="text-slate-500 font-medium mb-8">Add new links to your secure collection.</p>
            <BookmarkForm onAdd={addBookmark} />
          </div>
        </section>

        <section>
          <div className="flex items-center border-b border-slate-200 pb-6 mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Collection</h2>
            <div className="ml-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-black">
              Personal
            </div>
          </div>
          <BookmarkList bookmarks={bookmarks} loading={fetchingBookmarks} onDelete={deleteBookmark} />
        </section>
      </main>
    </div>
  )
}
