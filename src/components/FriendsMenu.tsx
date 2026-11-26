'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Users, X, Check, Copy, UserCheck, UserX } from "lucide-react"
import Avatar from "@/components/Avatar"
import { socket } from "@/sockets"

interface UserProfile {
    id: string
    name: string | null
    image: string | null
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    sender: UserProfile
    receiver: UserProfile
}

interface FriendsResponse {
    myId: string
    received: FriendRequest[]
    sent: FriendRequest[]
}

const POLL_INTERVAL_MS = 10_000

export default function FriendsMenu() {
    const { status } = useSession()
    const isAuthenticated = status === 'authenticated'

    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<FriendsResponse | null>(null)
    const [onlineIds, setOnlineIds] = useState<string[]>([])
    const [isCopied, setIsCopied] = useState(false)

    const [friendIdInput, setFriendIdInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [requestMessage, setRequestMessage] = useState('')
    const [isError, setIsError] = useState(false)

    const loadFriends = useCallback(async () => {
        try {
            const res = await fetch('/api/friends', { cache: 'no-store' })

            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            setData((await res.json()) as FriendsResponse)
        } catch (error) {
            console.error("Failed to load friends data:", error)
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated || !isOpen) return

        const interval = setInterval(() => void loadFriends(), POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [isAuthenticated, isOpen, loadFriends])

    useEffect(() => {
        if (!isAuthenticated) return

        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [isAuthenticated])

    const { incomingPending, acceptedFriends } = useMemo(() => {
        const received = data?.received ?? []
        const sent = data?.sent ?? []

        return {
            incomingPending: received.filter((request) => request.status === 'PENDING'),
            acceptedFriends: [
                ...received.filter((request) => request.status === 'ACCEPTED').map((request) => request.sender),
                ...sent.filter((request) => request.status === 'ACCEPTED').map((request) => request.receiver),
            ],
        }
    }, [data])

    const friendIdsKey = acceptedFriends.map((friend) => friend.id).join(',')

    useEffect(() => {
        if (!isAuthenticated || !isOpen || !friendIdsKey) return

        const ids = friendIdsKey.split(',')

        const checkOnline = () => {
            if (socket.connected) {
                socket.emit('check_online', ids, setOnlineIds)
            }
        }

        checkOnline()
        socket.on('connect', checkOnline)

        const interval = setInterval(checkOnline, POLL_INTERVAL_MS)

        return () => {
            socket.off('connect', checkOnline)
            clearInterval(interval)
        }
    }, [isAuthenticated, isOpen, friendIdsKey])

    useEffect(() => {
        if (!isCopied) return

        const timer = setTimeout(() => setIsCopied(false), 2000)
        return () => clearTimeout(timer)
    }, [isCopied])

    useEffect(() => {
        if (!requestMessage) return

        const timer = setTimeout(() => setRequestMessage(''), 2500)
        return () => clearTimeout(timer)
    }, [requestMessage])

    const openMenu = () => {
        setIsOpen(true)

        if (isAuthenticated) {
            void loadFriends()
        }
    }

    const handleCopyId = async () => {
        if (!data?.myId) return

        try {
            await navigator.clipboard.writeText(data.myId)
            setIsCopied(true)
        } catch {
            console.error("Clipboard is not available")
        }
    }

    const handleAddFriend = async () => {
        const targetId = friendIdInput.trim()

        if (!targetId) return

        setIsSending(true)
        setRequestMessage('')
        setIsError(false)

        try {
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId }),
            })

            if (res.ok) {
                setRequestMessage('Request sent successfully!')
                setFriendIdInput('')
                void loadFriends()
            } else {
                const body = (await res.json().catch(() => null)) as { message?: string } | null
                setRequestMessage(body?.message || 'Failed to send request')
                setIsError(true)
            }
        } catch {
            setRequestMessage('Network Error')
            setIsError(true)
        } finally {
            setIsSending(false)
        }
    }

    const handleResponse = async (requestId: string, action: 'ACCEPT' | 'DECLINE') => {
        try {
            const res = await fetch('/api/friends', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action }),
            })

            if (res.ok) {
                void loadFriends()
            }
        } catch (error) {
            console.error("Failed to respond to request", error)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={openMenu}
                className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-md"
            >
                <Users size={20} />
                Friends
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Friends"
                    className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-end sm:justify-end sm:items-start"
                >
                    <div className="w-full sm:max-w-md bg-sky-900 border-l border-sky-800 h-[85dvh] sm:h-full rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-white">Friends</h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setIsOpen(false)}
                                className="text-sky-300 hover:text-white hover:scale-110 transition-all"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="bg-sky-950 p-4 rounded-xl border border-sky-800 mb-8">
                            <p className="text-sky-500 font-semibold mb-2 text-sm uppercase">
                                My Friend ID
                            </p>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-sky-900 border border-sky-700 p-2 rounded-lg text-sky-200 font-mono text-sm overflow-hidden text-ellipsis">
                                    {isAuthenticated ? (data?.myId ?? 'Loading...') : 'Log in to see ID'}
                                </code>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    disabled={!data?.myId}
                                    className="flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-400 transition-all w-24 disabled:opacity-50"
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
                                    onChange={(event) => setFriendIdInput(event.target.value)}
                                    className="w-full bg-sky-900 border border-sky-700 p-3 rounded-lg text-sky-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-sky-600 transition-all"
                                />
                                <button
                                    type="button"
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
                                    {incomingPending.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between bg-sky-900 p-3 rounded-lg border border-sky-800"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar src={request.sender.image} name={request.sender.name} size={32} />
                                                <span className="font-bold text-white text-sm">
                                                    {request.sender.name || 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponse(request.id, 'ACCEPT')}
                                                    className="p-2 bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                                                    aria-label="Accept"
                                                    title="Accept"
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponse(request.id, 'DECLINE')}
                                                    className="p-2 bg-rose-600/30 text-rose-400 border border-rose-500/50 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                    aria-label="Decline"
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
                                    {acceptedFriends.map((friend) => {
                                        const isOnline = onlineIds.includes(friend.id)

                                        return (
                                            <div
                                                key={friend.id}
                                                className="flex items-center gap-3 bg-sky-900 p-3 rounded-lg border border-sky-800 hover:bg-sky-800/80 transition-all"
                                            >
                                                <Avatar src={friend.image} name={friend.name} size={40} />

                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm">
                                                        {friend.name || 'Unknown'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${
                                                                isOnline
                                                                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                                                    : 'bg-slate-500'
                                                            }`}
                                                        ></div>
                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                isOnline ? 'text-emerald-400' : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {isOnline ? 'Online' : 'Offline'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}