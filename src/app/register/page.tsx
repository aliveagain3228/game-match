'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthShell, { AuthDivider } from '@/components/auth/AuthShell'
import AuthInput from '@/components/auth/AuthInput'
import GoogleButton from '@/components/auth/GoogleButton'
import { registerFormSchema, type RegisterFormInput } from '@/lib/validations/auth'

interface RegisterErrorResponse {
    message?: string
    errors?: { field?: string; message: string }[]
}

export default function RegisterPage() {
    const router = useRouter()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInput>({
        resolver: zodResolver(registerFormSchema),
    })

    useEffect(() => {
        if (!isDone) return

        const timer = setTimeout(() => router.push('/login'), 1500)
        return () => clearTimeout(timer)
    }, [isDone, router])

    const onSubmit = async ({ name, email, password }: RegisterFormInput) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            if (res.ok) {
                setIsDone(true)
                return
            }

            const data = (await res.json().catch(() => null)) as RegisterErrorResponse | null

            if (res.status === 409) {
                setError('email', { message: data?.message ?? 'This email is already registered' })
                return
            }

            setError('root', {
                message: data?.errors?.[0]?.message ?? data?.message ?? 'Something went wrong',
            })
        } catch {
            setError('root', { message: 'Error connecting to the server' })
        }
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        await signIn('google', { callbackUrl: '/' })
    }

    const isBusy = isSubmitting || isGoogleLoading || isDone

    return (
        <AuthShell title="Create Account" subtitle="Join GameMatch today">
            {isDone && (
                <div className="p-3 rounded-xl mb-6 text-center font-medium border bg-emerald-950/50 text-emerald-400 border-emerald-800">
                    Success! Redirecting to login...
                </div>
            )}

            {errors.root?.message && (
                <div className="p-3 rounded-xl mb-6 text-center font-medium border bg-rose-950/50 text-rose-400 border-rose-800">
                    {errors.root.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <AuthInput
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    disabled={isBusy}
                    error={errors.name?.message}
                    {...register('name')}
                />
                <AuthInput
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    disabled={isBusy}
                    error={errors.email?.message}
                    {...register('email')}
                />
                <AuthInput
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    disabled={isBusy}
                    error={errors.password?.message}
                    {...register('password')}
                />
                <AuthInput
                    type="password"
                    placeholder="Repeat Password"
                    autoComplete="new-password"
                    disabled={isBusy}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full bg-violet-600 text-white font-bold rounded-xl px-4 py-4 mt-2 hover:bg-violet-500 hover:scale-[1.02] transition-all shadow-lg text-lg disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <AuthDivider label="Or sign up with" />

            <GoogleButton onClick={handleGoogleSignIn} disabled={isBusy} loading={isGoogleLoading} />

            <div className="mt-8 text-center">
                <span className="text-slate-400 font-medium">Already have an account? </span>
                <Link href="/login" className="text-violet-500 font-bold hover:underline">
                    Log in
                </Link>
            </div>
        </AuthShell>
    )
}