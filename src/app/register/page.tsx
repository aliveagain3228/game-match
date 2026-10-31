'use client'

import { useState, FormEvent } from 'react'

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('Sending data...')

        try {
            const res = await fetch('/api/auth/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (res.ok) {
                setMessage('Success: ' + data.message)
            } else {
                setMessage('Error: ' + (data.message || 'Something went wrong'))
            }
        } catch {
            setMessage('Error connecting to the server')
        }
    }

    return (
        <div
            style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}
        >
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ padding: '10px' }}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    style={{ padding: '10px' }}
                />

                <input
                    type="password"
                    placeholder="Password (min 6 digits)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    style={{ padding: '10px' }}
                />

                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
                    Create Account
                </button>
            </form>

            {message && <p style={{ marginTop: '20px', color: 'blue' }}>{message}</p>}
        </div>
    )
}