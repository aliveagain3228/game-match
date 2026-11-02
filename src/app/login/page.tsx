'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        const res = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
        })

        if (res?.error) {
            setError(res.error)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 font-sans px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Log in</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="email"
                       placeholder="Email"
                       value={form.email}
                       onChange={e => setForm({ ...form, email: e.target.value })}
                       required
                       className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input type="password"
                       placeholder="Password"
                       value={form.password}
                       onChange={e => setForm({ ...form, password: e.target.value })}
                       required
                       className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button type="submit" className="p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors cursor-pointer">
                    Sign in
                </button>
            </form>

            {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </div>
    )
}