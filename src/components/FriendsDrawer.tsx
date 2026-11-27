'use client'

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "motion/react"
import {
    CheckIcon,
    CopyIcon,
    PaperPlaneTiltIcon,
    UserCheckIcon,
    UserMinusIcon,
    UsersThreeIcon,
    XIcon,
} from "@phosphor-icons/react"
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

interface FriendsDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const POLL_INTERVAL_MS = 10_000

const sectionClass = "rounded-2xl border border-white/10 bg-white/5 p-4"
const sectionTitleClass = "mb-3 text-sm font-semibold tracking-wide text-sky-400 uppercase"

export default function FriendsDrawer({ isOpen, onClose }: FriendsDrawerProps) {
    const { status } = useSession()
    const isAuthenticated = status === 'authenticated'

    const [data, setData] = useState<FriendsResponse | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [onlineIds, setOnlineIds] = useState<string[]>([])
    const [isCopied, setIsCopied] = useState(false)

    const [friendIdInput, setFriendIdInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [requestMessage, setRequestMessage] = useState('')
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || !isOpen) return

        let isActive = true

        const load = () => {
            fetch('/api/friends', { cache: 'no-store' })
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json() as Promise<FriendsResponse>
                })
                .then((json) => {
                    if (isActive) setData(json)
                })
                .catch((error) => console.error("Failed to load friends data:", error))
        }

        load()
        const interval = setInterval(load, POLL_INTERVAL_MS)

        return () => {
            isActive = false
            clearInterval(interval)
        }
    }, [isAuthenticated, isOpen, refreshKey])

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

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
                setRefreshKey((value) => value + 1)
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
                setRefreshKey((value) => value + 1)
            }
        } catch (error) {
            console.error("Failed to respond to request", error)
        }
    }

    const isSendDisabled = isSending || !friendIdInput.trim()

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="friends-drawer"
                    className="fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        type="button"
                        aria-label="Close friends"
                        onClick={onClose}
                        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
                    />

                    <motion.aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="Friends"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col gap-5 overflow-y-auto border-l border-white/10 bg-sky-950/90 p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-3xl font-black text-white">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-cyan-500 text-sky-950">
                                    <UsersThreeIcon size={24} weight="fill" />
                                </span>
                                Friends
                            </h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                className="text-sky-300 transition-all hover:scale-110 hover:text-white"
                            >
                                <XIcon size={28} weight="bold" />
                            </button>
                        </div>

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>My Friend ID</p>
                            <div className="flex gap-2">
                                <code className="flex-1 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-2 font-mono text-sm text-ellipsis text-sky-200">
                                    {data?.myId ?? 'Loading...'}
                                </code>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    disabled={!data?.myId}
                                    className="flex w-28 items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2 font-bold text-sky-950 transition-all hover:bg-sky-400 disabled:opacity-50"
                                >
                                    {isCopied ? <CheckIcon size={18} weight="bold" /> : <CopyIcon size={18} weight="duotone" />}
                                    {isCopied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>Add Friend</p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste friend's id here..."
                                    value={friendIdInput}
                                    onChange={(event) => setFriendIdInput(event.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-sm text-sky-100 placeholder-sky-600 transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFriend}
                                    disabled={isSendDisabled}
                                    className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-bold shadow-md transition-all ${
                                        isSendDisabled
                                            ? 'cursor-not-allowed bg-white/5 text-sky-600'
                                            : 'bg-sky-500 text-sky-950 hover:bg-sky-400 active:scale-95'
                                    }`}
                                >
                                    <PaperPlaneTiltIcon size={18} weight="duotone" />
                                    {isSending ? 'Sending...' : 'Send Request'}
                                </button>
                                {requestMessage && (
                                    <p className={`text-center text-sm font-bold ${isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {requestMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {incomingPending.length > 0 && (
                            <div className={sectionClass}>
                                <p className={sectionTitleClass}>Friend Requests ({incomingPending.length})</p>
                                <div className="flex flex-col gap-3">
                                    {incomingPending.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar src={request.sender.image} name={request.sender.name} size={32} />
                                                <span className="text-sm font-bold text-white">
                                                    {request.sender.name || 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponse(request.id, 'ACCEPT')}
                                                    className="rounded-lg border border-emerald-500/50 bg-emerald-600/30 p-2 text-emerald-300 transition-all hover:bg-emerald-500 hover:text-white"
                                                    aria-label="Accept"
                                                    title="Accept"
                                                >
                                                    <UserCheckIcon size={18} weight="duotone" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleResponse(request.id, 'DECLINE')}
                                                    className="rounded-lg border border-rose-500/50 bg-rose-600/30 p-2 text-rose-300 transition-all hover:bg-rose-500 hover:text-white"
                                                    aria-label="Decline"
                                                    title="Decline"
                                                >
                                                    <UserMinusIcon size={18} weight="duotone" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>My Friends ({acceptedFriends.length})</p>
                            {acceptedFriends.length === 0 ? (
                                <p className="py-4 text-center text-sm font-medium text-sky-500/70">
                                    No friends added yet
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {acceptedFriends.map((friend) => {
                                        const isOnline = onlineIds.includes(friend.id)

                                        return (
                                            <div
                                                key={friend.id}
                                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                                            >
                                                <Avatar src={friend.image} name={friend.name} size={40} />

                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">
                                                        {friend.name || 'Unknown'}
                                                    </span>
                                                    <div className="mt-0.5 flex items-center gap-1.5">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${
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
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    )
}