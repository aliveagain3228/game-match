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
        <div className="flex items-center justify-center min-h-screen bg-sky-50 p-4 relative overflow-hidden">
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sky-900 font-bold bg-white px-4 py-2 rounded-xl shadow-md border border-sky-200 hover:bg-sky-100 transition-all z-10"
            >
                ⬅ Back to Lobby
            </button>

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white w-full max-w-md z-10">
                <h1 className="text-4xl font-black text-sky-900 mb-2 text-center">Welcome Back</h1>
                <p className="text-sky-500 text-center mb-8 font-medium">Log in to GameMatch</p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-sky-50 border border-sky-200 text-sky-900 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-sky-400 font-medium transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-sky-50 border border-sky-200 text-sky-900 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-sky-400 font-medium transition-all"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-sky-500 text-white font-bold rounded-xl px-4 py-4 mt-2 hover:bg-sky-400 hover:scale-[1.02] transition-all shadow-lg text-lg"
                    >
                        Sign In
                    </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-sky-200"></div>
                    <span className="text-sky-400 font-semibold text-sm whitespace-nowrap">
                        Or sign in with
                    </span>
                    <div className="flex-1 h-px bg-sky-200"></div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-sky-900 border-2 border-sky-100 rounded-xl font-bold text-lg hover:bg-sky-50 hover:border-sky-200 transition-all shadow-sm group"
                >
                    <FcGoogle size={26} className="group-hover:scale-110 transition-transform" />
                    Google
                </button>

                <div className="mt-8 text-center">
                    <span className="text-sky-500 font-medium">Don&apos;t have an account? </span>
                    <button
                        onClick={() => router.push('/register')}
                        className="text-sky-700 font-bold hover:underline"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    )
}