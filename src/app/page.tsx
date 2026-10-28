'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import { checkGameCount } from "@/services/rawg.service";


export default function Home() {

    const router = useRouter()
    const [joinCode, setJoinCode] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [mode, setMode] = useState("")
    const [platform, setPlatform] = useState("")
    const [isChecking, setIsChecking] = useState(false)


    const handleCreateRoom = async () => {
        let query = ''
        if (mode) query += `&tags=${mode}`
        if (platform) query += `&platforms=${platform}`

        setIsChecking(true)
        try {
            const count = await checkGameCount(query)
            setIsChecking(false)

            if (count === 0) {
                alert("No games were found based on these filters. Please adjust your settings!")
                return
            }

            if (count < 10) {
                const proceed = window.confirm(`A total of ${count} game(s) were found. That might not be enough for a game. Are you sure you want to continue?`)
                if (!proceed) return
            }

            const newRoomCode = Math.random().toString(36).substring(2, 8)
            const url = `/room?room=${newRoomCode}${query ? `&filter=${query}` : ''}`
            router.push(url)
        } catch (err) {
            setIsChecking(false)
            alert("An error occurred while searching for games. Please try again.")
        }
    }

    const handleJoinRoom = async () => {
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

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-between px-5 py-3 mb-2 bg-sky-950 text-sky-200 rounded-xl border border-sky-800 hover:bg-sky-800 transition-colors"
                >
                    <span className="font-bold">Filters & Settings</span>
                    <span>⚙️</span>
                </button>



                <button
                    onClick={handleCreateRoom}
                    disabled={isChecking}
                    className={`w-full py-4 text-white rounded-xl font-bold text-xl transition-all shadow-lg ${
                        isChecking ? 'bg-sky-700 cursor-not-allowed opacity-70' : 'bg-sky-500 hover:bg-sky-400 hover:scale-105'}`}
                >
                    {isChecking ? 'Checking...' : 'Create room'}
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

            {isModalOpen && (
                <div className="absolute inset-0 bg-sky-950/90 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
                    <div className="bg-sky-900 w-full max-w-sm rounded-2xl border border-sky-700 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-sky-400 hover:text-white text-xl transition-colors"
                        >
                            ✖
                        </button>

                        <h3 className="text-2xl font-black text-white mb-6">Settings</h3>

                        <div className="flex flex-col gap-5">

                            <div>
                                <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Game Mode:</label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="w-full px-4 py-3 bg-sky-950 text-white rounded-xl outline-none focus:ring-2 focus:ring-sky-400 border border-sky-800 font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">🌍 Any</option>
                                    <option value="co-op">🤝 Co-op</option>
                                    <option value="multiplayer">⚔️ Multiplayer</option>
                                    <option value="singleplayer">👤 Singleplayer</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Platform:</label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full px-4 py-3 bg-sky-950 text-white rounded-xl outline-none focus:ring-2 focus:ring-sky-400 border border-sky-800 font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">🎮 Any Platform</option>
                                    <option value="4">💻 PC</option>
                                    <option value="18">🟦 PlayStation 4/5</option>
                                    <option value="1">🟩 Xbox</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full mt-4 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-400 transition-colors shadow-md"
                            >
                                Save & Close
                            </button>

                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-6 text-sky-700 text-sm font-medium text-center w-full">
                © 2026 Nick Koida. All rights reserved.
            </div>

        </div>
    )
}
