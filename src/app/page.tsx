'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import { checkGameCount } from "@/services/rawg.service";
import { FaWindows, FaPlaystation, FaXbox, FaUserFriends, FaGlobe, FaGamepad, FaUser} from "react-icons/fa";
import { FaUserAstronaut} from "react-icons/fa6";
import { GiCrossedSwords } from "react-icons/gi";
import { Gamepad2, Clapperboard, Popcorn, Book, Settings } from "lucide-react";


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
        <div className="flex relative flex-col items-center justify-center min-h-screen bg-sky-950 text-white px-4 pt-24 pb-12">

            <header className="fixed top-0 left-0 w-full h-16 bg-sky-950/80 backdrop-blur-md border-b border-sky-800 z-50 flex items-center justify-between px-4 sm:px-8">

                <div
                    onClick={() => router.push('/')}
                    className="flex items-center gap-3 font-black text-xl tracking-tight cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                        <FaGamepad className="text-sky-950" size={20} />
                    </div>
                    <span className="text-sky-400 hidden sm:block">Game<span className="text-white">Match</span></span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500 text-sky-950 rounded-full font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 cursor-default shrink-0">
                        <Gamepad2 size={16} strokeWidth={2.5} /> Games
                    </button>
                    <button disabled className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-900/50 text-sky-400/60 rounded-full font-bold text-xs sm:text-sm border border-sky-800/50 cursor-not-allowed flex items-center gap-1.5 shrink-0">
                         <Clapperboard size={16} /> <span className="hidden sm:inline-block text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-500">Soon</span>
                    </button>
                    <button disabled className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-900/50 text-sky-400/60 rounded-full font-bold text-xs sm:text-sm border border-sky-800/50 cursor-not-allowed flex items-center gap-1.5 shrink-0">
                        <Popcorn size={16} /> Cartoons <span className="hidden sm:inline-block text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-500">Soon</span>
                    </button>
                    <button disabled className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-900/50 text-sky-400/60 rounded-full font-bold text-xs sm:text-sm border border-sky-800/50 cursor-not-allowed flex items-center gap-1.5 shrink-0">
                        <Book size={16} /> Books <span className="hidden sm:inline-block text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-500">Soon</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button className="w-9 h-9 rounded-full bg-sky-900 border border-sky-700 flex items-center justify-center hover:bg-sky-700 hover:text-white text-sky-400 transition-colors shadow-sm">
                        <FaUser size={14} />
                    </button>
                </div>
            </header>


            <h1 className="text-5xl font-black text-sky-400 mb-12 text-center drop-shadow-lg">
                Game<span className="text-white">Match</span>
            </h1>

            <div className="flex flex-col gap-6 w-full max-w-sm bg-sky-900 p-8 rounded-2xl shadow-2xl border border-sky-800">

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-between px-5 py-3 mb-2 bg-sky-950 text-sky-200 rounded-xl border border-sky-800 hover:bg-sky-800 transition-colors"
                >
                    <span className="font-bold">Filters & Settings</span>
                    <Settings size={18} className="text-sky-400 group-hover:rotate-90 transition-transform duration-300" />
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
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setMode("")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaGlobe size={16} /> Any
                                    </button>
                                    <button
                                        onClick={() => setMode("co-op")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "co-op" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaUserFriends size={16} /> Co-op
                                    </button>
                                    <button
                                        onClick={() => setMode("multiplayer")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "multiplayer" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <GiCrossedSwords size={16} /> Multiplayer
                                    </button>
                                    <button
                                        onClick={() => setMode("singleplayer")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "singleplayer" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaUserAstronaut size={16} /> Singleplayer
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Platform:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPlatform("")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaGlobe size={16} /> Any
                                    </button>
                                    <button
                                        onClick={() => setPlatform("4")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "4" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaWindows size={16} /> PC
                                    </button>
                                    <button
                                        onClick={() => setPlatform("18")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "18" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaPlaystation size={16} /> PS 4/5
                                    </button>
                                    <button
                                        onClick={() => setPlatform("1")}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "1" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}
                                    >
                                        <FaXbox size={16} /> Xbox
                                    </button>
                                </div>
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
