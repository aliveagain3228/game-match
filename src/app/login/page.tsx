'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        await signIn('credentials', {email, password, callbackUrl: '/'})
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] p-4 relative overflow-hidden">
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-violet-500 font-bold bg-[#151C2C] px-4 py-2 rounded-xl shadow-md border border-slate-700 hover:bg-slate-800 transition-all z-10"
            >
                ⬅ Back to Lobby
            </button>

            <div className="bg-[#151C2C] p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md z-10">
                <h1 className="text-4xl font-black text-white mb-2 text-center">Welcome Back</h1>
                <p className="text-sky-400 text-center mb-8 font-medium">Log in to GameMatch</p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white font-bold rounded-xl px-4 py-4 mt-2 hover:bg-violet-500 hover:scale-[1.02] transition-all shadow-lg text-lg"
                    >
                        Sign In
                    </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-slate-700"></div>
                    <span className="text-slate-400 font-semibold text-sm whitespace-nowrap">
                        Or sign in with
                    </span>
                    <div className="flex-1 h-px bg-slate-700"></div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1E293B] text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-sm group"
                >
                    <FcGoogle size={26} className="group-hover:scale-110 transition-transform" />
                    Google
                </button>

                <div className="mt-8 text-center">
                    <span className="text-slate-400 font-medium">Don&apos;t have an account? </span>
                    <button
                        onClick={() => router.push('/register')}
                        className="text-violet-500 font-bold hover:underline"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    )
}