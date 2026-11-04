'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, X, Check, Copy, User, UserCheck, UserX } from "lucide-react"
import { io } from "socket.io-client"

export default function FriendsMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [myId, setMyId] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)

    const [friendIdInput, setFriendIdInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [requestMessage, setRequestMessage] = useState('')
    const [isError, setIsError] = useState(false)

    const [receivedRequests, setReceivedRequests] = useState<any[]>([])
    const [sentRequests, setSentRequests] = useState<any[]>([])

    const [onlineIds, setOnlineIds] = useState<string[]>([])

    useEffect(() => {
        if (myId && myId !== "Log in to see ID") {
            const socket = io('https://gamematch-backend-9y1r.onrender.com')
            socket.emit('user_connected', myId)
            socket.on('update_online_users', (users: string[]) => {
                setOnlineIds(users)
            })
            return () => {
                socket.disconnect()
            }
        }
    }, [myId])

    const loadFriendsData = useCallback(() => {
        fetch('/api/friends')
            .then(async (res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Not logged in" : "Server error")
                return res.json()
            })
            .then(data => {
                setMyId(data.myId)
                setReceivedRequests(data.received || [])
                setSentRequests(data.sent || [])
            })
            .catch(err => {
                console.error("Failed to load friends data:", err)
                setMyId("Log in to see ID")
            })
    }, [])


    useEffect(() => {
        if (isOpen) {
            loadFriendsData()
        }
    }, [isOpen, loadFriendsData])

    useEffect(() => {
        if (isOpen) loadFriendsData()

    }, [isOpen, loadFriendsData])

    const handleCopyId = () => {
        if (myId && myId !== "Log in to see ID") {
            navigator.clipboard.writeText(myId)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const handleAddFriend = async () => {
        if (!friendIdInput.trim()) return

        setIsSending(true)
        setRequestMessage('')
        setIsError(false)

        try {
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId: friendIdInput.trim() })
            })

            if (res.ok) {
                setRequestMessage('Request sent successfully!')
                setFriendIdInput('')
                loadFriendsData()
            } else {
                const errorText = await res.text()
                setRequestMessage(errorText || 'Failed to send request')
                setIsError(true)
            }
        } catch (err) {
            setRequestMessage('Network Error')
            setIsError(true)
        } finally {
            setIsSending(false)
            setTimeout(() => setRequestMessage(''), 2000)
        }
    }

    const handleResponse = async (requestId: string, action: 'ACCEPT' | 'DECLINE')=> {
        try {
            const res = await fetch('/api/friends', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action })
            })

            if (res.ok) {
                loadFriendsData()
            }
        } catch (err) {
            console.error("Failed to respond to request", err)
        }
    }

    const incomingPending = receivedRequests.filter(r => r.status === 'PENDING')

    const acceptedFriends = [
        ...receivedRequests.filter(r => r.status === 'ACCEPTED').map(r => r.sender),
        ...sentRequests.filter(r => r.status === 'ACCEPTED').map(r => r.receiver),
    ]

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

                        <div className="bg-sky-950 p-4 rounded-xl border border-sky-800 mb-8">
                            <p className="text-sky-500 font-semibold mb-3 text-sm uppercase">
                                Add Friend
                            </p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste friend's id here..."
                                    value={friendIdInput}
                                    onChange={(e) => setFriendIdInput(e.target.value)}
                                    className="w-full bg-sky-900 border border-sky-700 p-3 rounded-lg text-sky-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-sky-600 transition-all"
                                />
                                <button
                                    onClick={handleAddFriend}
                                    disabled={isSending || !friendIdInput.trim()}
                                    className={`w-full py-2.5 rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                                        isSending || !friendIdInput.trim()
                                            ? 'bg-sky-800/50 text-sky-600 cursor-not-allowed'
                                            : 'bg-sky-500 text-white hover:bg-sky-400 active:scale-95'
                                    }`}
                                >
                                    {isSending ? 'Sending...' : 'Send Request'}
                                </button>
                                {requestMessage && (
                                    <p className={`text-center text-sm font-bold mt-1 ${isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {requestMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {incomingPending.length > 0 && (
                            <div className="bg-sky-950 p-4 rounded-xl border border-sky-800 mb-6">
                                <p className="text-sky-400 font-semibold mb-3 text-sm uppercase">
                                    Friend Requests ({incomingPending.length})
                                </p>
                                <div className="flex flex-col gap-3">
                                    {incomingPending.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between bg-sky-900 p-3 rounded-lg border border-sky-800">
                                            <div className="flex items-center gap-3">
                                                {req.sender.image ? (
                                                    <img
                                                        src={req.sender.image}
                                                        alt={req.sender.name}
                                                        className="w-8 h-8 rounded-full border border-sky-700 object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-sky-800 border border-sky-700 flex items-center justify-center">
                                                        <User size={14} className="text-sky-300" />
                                                    </div>
                                                )}
                                                <span className="font-bold text-white text-sm">
                                                    {req.sender.name || req.sender.email}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                onClick={() => handleResponse(req.id, 'ACCEPT')}
                                                className="p-2 bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                                                title="Accept"
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(req.id, 'DECLINE')}
                                                    className="p-2 bg-rose-600/30 text-rose-400 border border-rose-500/50 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                    title="Decline"
                                                >
                                                    <UserX size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-sky-950 p-4 rounded-xl border border-sky-800">
                            <p className="text-sky-500 font-semibold mb-3 text-sm uppercase">
                                My Friends ({acceptedFriends.length})
                            </p>
                            {acceptedFriends.length === 0 ? (
                                <p className="text-center text-sky-500/70 text-sm py-4 font-medium">
                                    No friends added yet
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {acceptedFriends.map((friend) => (
                                        <div key={friend.id} className="flex items-center gap-3 bg-sky-900 p-3 rounded-lg border border-sky-800 hover:bg-sky-800/80 cursor-pointer transition-all">
                                            {friend.image ? (
                                                <img
                                                    src={friend.image}
                                                    alt={friend.name}
                                                    className="w-10 h-10 rounded-full border border-sky-700 object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-sky-800 border border-sky-700 flex items-center justify-center">
                                                    <User size={16} className="text-sky-300" />
                                                </div>
                                            )}

                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-sm">
                                                    {friend.name || friend.email}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${
                                                        onlineIds.includes(friend.id)
                                                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                                        : 'bg-slate-500'
                                                    }`}></div>
                                                    <span
                                                        className={`text-xs font-semibold ${
                                                            onlineIds.includes(friend.id)
                                                                ? 'text-emerald-400'
                                                                : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {onlineIds.includes(friend.id) ? 'Online' : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}