'use client'

import { useEffect } from "react"
import { motion } from "motion/react"
import { DoorOpenIcon } from "@phosphor-icons/react"

interface LeaveRoomDialogProps {
    roomId: string
    onStay: () => void
    onLeave: () => void
}

export default function LeaveRoomDialog({ roomId, onStay, onLeave }: LeaveRoomDialogProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onStay()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onStay])

    return (
        <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="leave-room-title"
            aria-describedby="leave-room-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-sky-950/85 px-4 py-10 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.92, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-sky-900/50 p-8 text-center shadow-2xl backdrop-blur-xl"
            >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-rose-500 text-white shadow-[0_0_30px_rgba(251,113,133,0.45)]">
                    <DoorOpenIcon size={34} weight="duotone" />
                </div>

                <h2 id="leave-room-title" className="text-3xl font-black text-white">
                    Leave this room?
                </h2>

                <p id="leave-room-description" className="mt-3 text-base font-medium text-sky-200">
                    You will be disconnected from room{" "}
                    <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-sky-100">{roomId}</span>.
                    Your partner stays in the room and will be told that you left. You can come back any time with
                    the same code.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
                    <button
                        type="button"
                        autoFocus
                        onClick={onStay}
                        className="flex-1 rounded-xl bg-sky-500 px-6 py-3.5 text-lg font-bold text-sky-950 shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all hover:bg-sky-400"
                    >
                        Stay
                    </button>
                    <button
                        type="button"
                        onClick={onLeave}
                        className="flex-1 rounded-xl border border-rose-400/40 bg-rose-500/10 px-6 py-3.5 text-lg font-bold text-rose-300 transition-all hover:bg-rose-500/25"
                    >
                        Leave room
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}