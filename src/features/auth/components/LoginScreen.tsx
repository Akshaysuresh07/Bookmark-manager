'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginScreen() {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        if (!supabase) {
            alert('Supabase is not configured. Please check your .env.local file.')
            return
        }

        // Use the environment variable for redirects to be more robust in production
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        const redirectTo = `${baseUrl.replace(/\/$/, '')}/auth/callback`

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        })
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0F172A] overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-2xl border border-white/10 text-center space-y-10 group">
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] transform hover:scale-110 transition-transform duration-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black text-white tracking-tighter">BookmarkHub</h1>
                            <p className="text-indigo-200/60 text-lg font-medium">Your universal digital archive.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="group relative flex items-center justify-center w-full bg-white hover:bg-white text-slate-900 font-black py-5 px-8 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-[0.98]"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-6 h-6 mr-4 group-hover:rotate-[360deg] transition-transform duration-700"
                            />
                            <span className="text-xl">Continue with Google</span>
                        </button>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-[0.2em]">One-click secure access</p>
                    </div>
                </div>
                {/* 
                <div className="mt-12 flex justify-center space-x-6 text-indigo-300/30 text-xs font-bold uppercase tracking-widest">
                    <span>Encrypted</span>
                    <span>•</span>
                    <span>Cloud Sync</span>
                    <span>•</span>
                    <span>Real-time</span>
                </div> */}
            </div>
        </div>
    )
}
