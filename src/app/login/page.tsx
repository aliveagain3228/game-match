'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthShell, { AuthDivider } from '@/components/auth/AuthShell'
import AuthInput from '@/components/auth/AuthInput'
import GoogleButton from '@/components/auth/GoogleButton'
import { getSafeCallbackUrl} from "@/lib/safeDirect";
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

const URL_ERRORS: Record<string, string> = {
    OAuthAccountNotLinked: 'This email is already registered with a password. Please sign in with your email and password.',
    AccessDenied: 'Access was denied. Please try again.',
    Callback: 'Google sign-in failed. Please try again.',
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'))
    const urlErrorCode = searchParams.get('error')
    const urlError = urlErrorCode ? (URL_ERRORS[urlErrorCode] ?? 'Something went wrong. Please try again.') : null

    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (values: LoginInput) => {
        try {
            const res = await signIn('credentials', { ...values, redirect: false })

            if (res?.error) {
                setError('root', {
                    message: res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error,
                })
                return
            }

            router.push(callbackUrl)
            router.refresh()
        } catch {
            setError('root', { message: 'An unexpected error occurred. Please try again.' })
        }
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        await signIn('google', { callbackUrl })
    }

    const formError = errors.root?.message ?? urlError
    const isBusy = isSubmitting || isGoogleLoading

    return (
        <>
            {formError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center font-medium">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
                    autoComplete="current-password"
                    disabled={isBusy}
                    error={errors.password?.message}
                    {...register('password')}
                />

                <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full bg-violet-600 text-white font-bold rounded-xl px-4 py-4 mt-2 hover:bg-violet-500 hover:scale-[1.02] transition-all shadow-lg text-lg disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <AuthDivider label="Or sign in with" />

            <GoogleButton onClick={handleGoogleSignIn} disabled={isBusy} loading={isGoogleLoading} />

            <div className="mt-8 text-center">
                <span className="text-slate-400 font-medium">Don&apos;t have an account? </span>
                <Link href="/register" className="text-violet-500 font-bold hover:underline">
                    Sign up
                </Link>
            </div>
        </>
    )
}

export default function LoginPage() {
    return (
        <AuthShell title="Welcome Back" subtitle="Log in to GameMatch">
            <Suspense>
                <LoginForm />
            </Suspense>
        </AuthShell>
    )
}