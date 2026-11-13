'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)


    const handleRegister = async (formData: FormData) => {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if(password !== confirmPassword) {
            setIsError(true)
            setMessage("Passwords do not match")
            return
        }

        setMessage('Sending data...')
        setIsError(false)
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name, email, password}),
            })

            const data = await res.json()
            if (res.ok) {
                setMessage('Success! Redirecting to login...')
                setIsError(false)
                setTimeout(() => router.push('/login'), 1500)
            } else {
                if (data.errors && data.errors.length > 0) {
                    setMessage(data.errors[0].message)
                } else {
                    setMessage(data.message || 'Something went wrong')
                }
                setIsError(true)
                setIsLoading(false)
            }
        } catch {
            setMessage('Error connecting to the server')
            setIsError(true)
            setIsLoading(false)
        }
        }
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        await signIn('google', { callbackUrl: '/' })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] p-4 relative overflow-hidden">
            <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-violet-500 font-bold bg-[#151C2C] px-4 py-2 rounded-xl shadow-md border border-slate-700 hover:bg-slate-800 transition-all z-10 disabled:opacity-50"
            >
                ⬅ Back to Lobby
            </button>

            <div className="bg-[#151C2C] p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md z-10">
                <h1 className="text-4xl font-black text-white mb-2 text-center">Create Account</h1>
                <p className="text-sky-400 text-center mb-6 font-medium">Join GameMatch today</p>

                {message && (
                    <div className={`p-3 rounded-xl mb-6 text-center font-medium border ${isError ? 'bg-rose-950/50 text-rose-400 border-rose-800' : 'bg-emerald-950/50 text-emerald-400 border-emerald-800'}`}>
                        {message}
                    </div>
                )}

                <form action={handleRegister} className="flex flex-col gap-4">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all disabled:opacity-50"
                        required
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all disabled:opacity-50"
                        required
                    />
                    <input
                        id="password"
                        name="ocnfirmPassword"
                        type="password"
                        placeholder="Repeat Password"
                        autoComplete="new-password"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all disabled:opacity-50"
                        required
                    />
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repeat Password"
                        autoComplete="new-password"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full bg-[#0B0F19] border border-slate-700 text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all disabled:opacity-50"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full bg-violet-600 text-white font-bold rounded-xl px-4 py-4 mt-2 hover:bg-violet-500 hover:scale-[1.02] transition-all shadow-lg text-lg disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                        >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-slate-700"></div>
                    <span className="text-slate-400 font-semibold text-sm whitespace-nowrap">
                        Or sign up with
                    </span>
                    <div className="flex-1 h-px bg-slate-700"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1E293B] text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-sm group disabled:opacity-50"
                >
                    <FcGoogle size={26} className="group-hover:scale-110 transition-transform" />
                    {isGoogleLoading ? 'Connecting...' : 'Google'}
                </button>

                <div className="mt-8 text-center">
                    <span className="text-slate-400 font-medium">Already have an account? </span>
                    <button
                        type="button"
                        disabled={isLoading || isGoogleLoading  }
                        onClick={() => router.push('/login')}
                        className="text-violet-500 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                        Log in
                    </button>
                </div>
            </div>
        </div>
    )
}