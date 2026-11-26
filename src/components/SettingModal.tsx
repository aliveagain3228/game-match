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

const MODES = [
    { value: "", label: "Any", Icon: FaGlobe },
    { value: "co-op", label: "Co-op", Icon: FaUserFriends },
    { value: "multiplayer", label: "Multiplayer", Icon: GiCrossedSwords },
    { value: "singleplayer", label: "Singleplayer", Icon: FaUserAstronaut },
]

const PLATFORMS = [
    { value: "", label: "Any", Icon: FaGlobe },
    { value: "4", label: "PC", Icon: FaWindows },
    { value: "18,187", label: "PS 4/5", Icon: FaPlaystation },
    { value: "1,186", label: "Xbox", Icon: FaXbox },
]

const optionClass = (active: boolean) =>
    `flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border ${
        active
            ? "bg-sky-500 text-white border-sky-400 shadow-lg"
            : "bg-sky-950 text-sky-400 border-sky-800 hover:bg-sky-800"
    }`

export default function SettingsModal({ mode, setMode, platform, setPlatform, onClose }: SettingsModalProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            className="fixed inset-0 bg-sky-950/90 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
        >
            <div className="bg-sky-900 w-full max-w-sm rounded-2xl border border-sky-700 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    type="button"
                    aria-label="Close"
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
                            {MODES.map(({ value, label, Icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setMode(value)}
                                    className={optionClass(mode === value)}
                                >
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sky-200 text-sm font-bold ml-1 mb-2 block">Platform:</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PLATFORMS.map(({ value, label, Icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setPlatform(value)}
                                    className={optionClass(platform === value)}
                                >
                                    <Icon size={16} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full mt-4 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-400 transition-colors shadow-md"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    )
}