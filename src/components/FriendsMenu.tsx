'use client'

import { useState, useEffect } from 'react'
import { Users, X, Check, Copy } from "lucide-react"

export default function FriendsMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [myId, setMyId] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (isOpen && !myId) {
            fetch('/api/friends')
                .then(async (res) => {
                    if (!res.ok) throw new Error(res.status === 401 ? "Not logged in" : "Server error")
                    return res.json()
                })
                .then(data => setMyId(data.myId))
                .catch(err => {
                    console.error("Failed to load friends data:", err)
                    setMyId("Log in to see ID")
                })
        }
    }, [isOpen, myId])

    const handleCopyId = () => {
        if (myId && myId !== "Log in to see ID") {
            navigator.clipboard.writeText(myId)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    return (
        <>
        <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-md"
        >
            <Users size={20} />
            Friends
        </button>
            {isOpen && (
                <div className="absolute inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-end sm:justify-end sm:items-start">
                    <div className="w-full sm:max-w-md bg-sky-900 border-l border-sky-800 h-[85vh] sm:h-full rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-white">Friends</h2>
                            <button onClick={() => setIsOpen(false)} className="text-sky-300 hover:text-white hover:scale-110 transition-all">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="bg-sky-950 p-4 rounded-xl border border-sky-800 mb-8">
                            <p className="text-sky-500 font-semibold mb-2 text-sm uppercase">
                                My Friend ID
                            </p>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-sky-900 border border-sky-700 p-2 rounded-lg text-sky-200 font-mono text-sm overflow-hidden text-ellipsis">
                                    {myId || 'Loading...'}
                                </code>
                                <button
                                    onClick={handleCopyId}
                                    className="flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-400 transition-all w-24"
                                >
                                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                                    {isCopied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-sky-400 font-medium">
                            Search and requests will be here...
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}