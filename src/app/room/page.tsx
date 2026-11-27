import { Suspense } from "react"
import RoomEntry from "@/components/RoomEntry"

export default function RoomPage() {
    return (
        <main>
            <Suspense
                fallback={
                    <div className="flex min-h-screen items-center justify-center">
                        <p className="animate-pulse text-xl font-bold text-sky-200">Loading...</p>
                    </div>
                }
            >
                <RoomEntry />
            </Suspense>
        </main>
    )
}