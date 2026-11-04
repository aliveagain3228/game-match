'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import { checkGameCount } from "@/services/rawg.service";
import { Settings } from "lucide-react";
import FriendsMenu from "../components/FriendsMenu";
import Header from "../components/Header";
import SettingModal from "../components/SettingModal";


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
        } catch (err: any) {
            setIsChecking(false)
            console.error("RAWG API Error:", err)
            alert(`Error: ${err.message || 'Check console (F12)'}`)
        }
    }

    const handleJoinRoom = async () => {
        if (joinCode.trim() !== "") {
            router.push(`/room?room=${joinCode}`)
        }
    }

    return (
        <div className="flex relative flex-col items-center justify-center min-h-screen bg-sky-950 text-white px-4 pt-24 pb-12">
            <Header />

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

                <FriendsMenu />

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
               <SettingModal
                   mode={mode}
                   setMode={setMode}
                   platform={platform}
                   setPlatform={setPlatform}
                   onClose={() => setIsModalOpen(false)}
               />
            )}

            <div className="absolute bottom-6 text-sky-700 text-sm font-medium text-center w-full">
                © 2026 Nick Koida. All rights reserved.
            </div>

        </div>
    )
}
