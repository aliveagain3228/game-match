'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'



export default function Home() {

    const router = useRouter()
    const [joinCode, setJoinCode] = useState('')
    const [gameFilter, setGameFilter] = useState('')

    const handleCreateRoom = () => {
        const newRoomCode = Math.random().toString(36).substring(2, 8)
        const url = `/room?room=${newRoomCode}${gameFilter ? `&filter=${gameFilter}` : ''}`
        router.push(url)
    }

    const handleJoinRoom = () => {
        if (joinCode.trim() !== "") {
            router.push(`/room?room=${joinCode}`)
        }
    }

    return (
        <div className="flex relative flex-col items-center justify-center min-h-screen bg-sky-950 text-white px-4">
            <h1 className="text-5xl font-black text-sky-400 mb-12 text-center">
                Game<span className="text-white">Match</span>
            </h1>

            <div className="flex flex-col gap-6 w-full max-w-sm bg-sky-900 p-8 rounded-2xl shadow-2xl border border-sky-800">

                <div className="flex flex-col gap-2 mb-2">
                    <label className="text-sky-200 text-sm font-bold ml-1">Game mode:</label>
                    <select
                        value={gameFilter}
                        onChange={(e) => setGameFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-sky-950 text-white rounded-xl outline-none focus:ring-2 focus:ring-sky-400 border border-sky-800 font-medium appearance-none cursor-pointer"
                    >
                        <option value="">🌍 Any games</option>
                        <option value="coop"> 🤝 Only coop</option>
                        <option value="multiplayer"> ⚔️ Multiplayer</option>
                        <option value="singleplayer"> 👤 Singleplayer </option>
                    </select>
                </div>

                <button
                    onClick={handleCreateRoom}
                    className="w-full py-4 bg-sky-500 text-white rounded-xl font-bold text-xl hover:bg-sky-400 hover:scale-105 transition-all shadow-lg"
                >
                    Create Room
                </button>

                <div className="flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-sky-700"></div>
                    <span className="text-sky-300 font-medium uppercase text-sm">Or</span>
                    <div className="flex-1 h-px bg-sky-700"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Type code room"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="w-full px-4 py-4 bg-sky-950 text-white placeholder-sky-600 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 border border-sky-800 font-medium text-center text-lg"
                    />
                    <button
                        onClick={handleJoinRoom}
                        className="w-full py-4 bg-white text-sky-900 rounded-xl font-bold text-xl hover:bg-sky-50 hover:scale-105 transition-all shadow-lg"
                    >
                        Enter
                    </button>
                </div>

            </div>

            <div className="absolute bottom-6 text-sky-700 text-sm font-medium text-center w-full">
                © 2026 Nick Koida. All rights reserved.
            </div>

        </div>
    )
}
