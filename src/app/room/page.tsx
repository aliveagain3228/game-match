import { Suspense } from "react"
import RoomEntry from "@/components/RoomEntry"

export default function RoomPage() {
    return (
        <main>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen bg-sky-50">
                        <p className="text-xl font-bold text-sky-900 animate-pulse">Loading...</p>
                    </div>
                }
            >
                <RoomEntry />
            </Suspense>
        </main>
    )
}