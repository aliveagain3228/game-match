'use client'

import { FaWindows, FaPlaystation, FaXbox, FaUserFriends, FaGlobe } from "react-icons/fa"
import { FaUserAstronaut } from "react-icons/fa6"
import { GiCrossedSwords } from "react-icons/gi"

interface SettingsModalProps {
    mode: string
    setMode: (mode: string) => void
    platform: string
    setPlatform: (platform: string) => void
    onClose: () => void
}

export default function SettingsModal({ mode, setMode, platform, setPlatform, onClose }: SettingsModalProps) {
    return (
        <div className="absolute inset-0 bg-sky-950/90 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <div className="bg-sky-900 w-full max-w-sm rounded-2xl border border-sky-700 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sky-400 hover:text-white text-xl transition-colors"
                >
                    ✖
                </button>
                <h3 className="text-2xl font-black text-white mb-6">Settings</h3>
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Game Mode:</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setMode("")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaGlobe size={16} /> Any
                            </button>
                            <button onClick={() => setMode("co-op")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "co-op" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaUserFriends size={16} /> Co-op
                            </button>
                            <button onClick={() => setMode("multiplayer")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "multiplayer" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <GiCrossedSwords size={16} /> Multiplayer
                            </button>
                            <button onClick={() => setMode("singleplayer")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${mode === "singleplayer" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaUserAstronaut size={16} /> Singleplayer
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Platform:</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setPlatform("")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaGlobe size={16} /> Any
                            </button>
                            <button onClick={() => setPlatform("4")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "4" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaWindows size={16} /> PC
                            </button>
                            <button onClick={() => setPlatform("18")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "18" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaPlaystation size={16} /> PS 4/5
                            </button>
                            <button onClick={() => setPlatform("1")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${platform === "1" ? "bg-sky-500 text-white border-sky-400 shadow-lg" : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"}`}>
                                <FaXbox size={16} /> Xbox
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full mt-4 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-400 transition-colors shadow-md">
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    )
}