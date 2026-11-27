'use client'

import { useEffect, type ReactNode } from "react"
import { SiPlaystation } from "react-icons/si"
import { FaXbox } from "react-icons/fa6"
import {
    GlobeIcon,
    HandshakeIcon,
    SparkleIcon,
    SwordIcon,
    UserIcon,
    WindowsLogoIcon,
    XIcon,
} from "@phosphor-icons/react"

interface SettingsModalProps {
    mode: string
    setMode: (mode: string) => void
    platform: string
    setPlatform: (platform: string) => void
    onClose: () => void
}

interface Option {
    value: string
    label: string
    icon: ReactNode
    tone: string
}

const MODES: Option[] = [
    { value: "", label: "Any", icon: <SparkleIcon size={22} weight="fill" />, tone: "from-sky-400 to-cyan-500" },
    { value: "co-op", label: "Co-op", icon: <HandshakeIcon size={22} weight="fill" />, tone: "from-emerald-400 to-teal-500" },
    { value: "multiplayer", label: "Multiplayer", icon: <SwordIcon size={22} weight="fill" />, tone: "from-rose-400 to-orange-500" },
    { value: "singleplayer", label: "Singleplayer", icon: <UserIcon size={22} weight="fill" />, tone: "from-violet-400 to-indigo-500" },
]

const PLATFORMS: Option[] = [
    { value: "", label: "Any", icon: <GlobeIcon size={22} weight="fill" />, tone: "from-sky-400 to-cyan-500" },
    { value: "4", label: "PC", icon: <WindowsLogoIcon size={22} weight="fill" />, tone: "from-sky-500 to-blue-600" },
    { value: "18,187", label: "PS 4/5", icon: <SiPlaystation size={20} />, tone: "from-blue-500 to-indigo-700" },
    { value: "1,186", label: "Xbox", icon: <FaXbox size={22} />, tone: "from-green-500 to-emerald-700" },
]

interface OptionGridProps {
    title: string
    options: Option[]
    selected: string
    onSelect: (value: string) => void
}

function OptionGrid({ title, options, selected, onSelect }: OptionGridProps) {
    return (
        <div>
            <p className="mb-2 ml-1 text-sm font-bold text-sky-200">{title}</p>
            <div className="grid grid-cols-2 gap-2">
                {options.map(({ value, label, icon, tone }) => {
                    const isActive = selected === value

                    return (
                        <button
                            key={label}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onSelect(value)}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                                isActive
                                    ? "border-sky-400 bg-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.35)]"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                        >
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md ${tone}`}
                            >
                                {icon}
                            </span>
                            <span className={`text-sm font-bold ${isActive ? "text-white" : "text-sky-200"}`}>
                                {label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function SettingsModal({ mode, setMode, platform, setPlatform, onClose }: SettingsModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-sky-950/80 backdrop-blur-sm"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Settings"
                className="relative max-h-[90dvh] w-full max-w-sm overflow-y-auto rounded-3xl border border-white/10 bg-sky-900/60 p-6 shadow-2xl backdrop-blur-xl"
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sky-300 transition-colors hover:text-white"
                >
                    <XIcon size={24} weight="bold" />
                </button>

                <h3 className="mb-6 text-2xl font-black text-white">Settings</h3>

                <div className="flex flex-col gap-5">
                    <OptionGrid title="Game Mode" options={MODES} selected={mode} onSelect={setMode} />
                    <OptionGrid title="Platform" options={PLATFORMS} selected={platform} onSelect={setPlatform} />

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-2 w-full rounded-xl bg-sky-500 py-4 text-lg font-bold text-sky-950 shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-colors hover:bg-sky-400"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    )
}