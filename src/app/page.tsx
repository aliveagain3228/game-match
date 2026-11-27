'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { SlidersHorizontalIcon } from '@phosphor-icons/react'
import { checkGameCount } from '@/services/rawg.service'
import { buildRoomUrl, createRoomCode } from '@/lib/room'
import DecorCards from '@/components/DecorCards'
import SettingModal from '@/components/SettingModal'

export default function Home() {
    const router = useRouter()
    const { status } = useSession()

    const [joinCode, setJoinCode] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [mode, setMode] = useState('')
    const [platform, setPlatform] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)

    const buildFilter = () => {
        const params = new URLSearchParams()

        if (mode) params.set('tags', mode)
        if (platform) params.set('platforms', platform)

        return params.toString()
    }

    const handleCreateRoom = async () => {
        if (status !== 'authenticated') {
            router.push('/login')
            return
        }

        const filter = buildFilter()

        setCreateError(null)
        setIsChecking(true)

        try {
            const count = await checkGameCount(filter)

            if (count === 0) {
                setCreateError('No games were found based on these filters. Please adjust your settings!')
                return
            }

            if (count < 10) {
                const proceed = window.confirm(
                    `A total of ${count} game(s) were found. That might not be enough for a game. Are you sure you want to continue?`
                )

                if (!proceed) return
            }

            router.push(buildRoomUrl(createRoomCode(), filter))
        } catch (error) {
            console.error('Games API Error:', error)
            setCreateError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
        } finally {
            setIsChecking(false)
        }
    }

    const handleJoinRoom = () => {
        const code = joinCode.trim()

        if (!code) return

        router.push(`/room?room=${encodeURIComponent(code)}`)
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-white">
            <DecorCards />

            <h1 className="relative mb-10 text-center text-5xl font-black text-sky-400 drop-shadow-lg sm:text-6xl">
                Game<span className="text-white">Match</span>
            </h1>

            <div className="relative flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-white/10 bg-sky-900/40 p-8 shadow-2xl backdrop-blur-xl">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sky-100 transition-colors hover:bg-white/10"
                >
                    <span className="font-bold">Filters & Settings</span>
                    <SlidersHorizontalIcon size={22} weight="duotone" className="text-sky-400 transition-transform duration-300 group-hover:scale-110" />
                </button>

                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleCreateRoom}
                        disabled={isChecking}
                        className={`w-full rounded-xl py-4 text-xl font-bold text-white shadow-[0_0_30px_rgba(14,165,233,0.35)] transition-all ${
                            isChecking ? 'cursor-not-allowed bg-sky-700 opacity-70' : 'bg-sky-500 hover:scale-105 hover:bg-sky-400'
                        }`}
                    >
                        {isChecking ? 'Checking...' : 'Create room'}
                    </button>
                    {createError && (
                        <p className="text-center text-sm font-bold text-rose-400">{createError}</p>
                    )}
                </div>

                <div className="my-1 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-sm font-medium uppercase text-sky-300">Or</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Type code room"
                        value={joinCode}
                        onChange={(event) => setJoinCode(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') handleJoinRoom()
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-lg font-medium text-white placeholder-sky-500 outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <button
                        type="button"
                        onClick={handleJoinRoom}
                        className="w-full rounded-xl bg-white py-4 text-xl font-bold text-sky-950 shadow-lg transition-all hover:scale-105 hover:bg-sky-50"
                    >
                        Enter
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <SettingModal
                    mode={mode}
                    setMode={setMode}
                    platform={platform}
                    setPlatform={setPlatform}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <div className="absolute bottom-6 w-full text-center text-sm font-medium text-sky-400/70">
                © 2026 Nick Koida. All rights reserved.
            </div>
        </div>
    )
}