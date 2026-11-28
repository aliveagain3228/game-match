import { Suspense } from "react"
import GameLoader from "@/components/GameLoader"
import RoomEntry from "@/components/RoomEntry"

export default function RoomPage() {
    return (
        <main>
            <Suspense fallback={<GameLoader fullscreen />}>
                <RoomEntry />
            </Suspense>
        </main>
    )
}