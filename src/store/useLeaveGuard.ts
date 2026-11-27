import { create } from "zustand"

interface LeaveGuardState {
    isRoomActive: boolean
    pendingHref: string | null
    setRoomActive: (value: boolean) => void
    requestLeave: (href: string) => void
    cancelLeave: () => void
}

export const useLeaveGuard = create<LeaveGuardState>()((set) => ({
    isRoomActive: false,
    pendingHref: null,
    setRoomActive: (value) => set({ isRoomActive: value, pendingHref: null }),
    requestLeave: (href) => set({ pendingHref: href }),
    cancelLeave: () => set({ pendingHref: null }),
}))