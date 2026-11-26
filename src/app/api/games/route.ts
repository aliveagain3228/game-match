import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { buildRawgQuery, mapRawgToGame, type RawgGame } from "@/lib/rawg"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiKey = process.env.RAWG_API_KEY

    if (!apiKey) {
        return NextResponse.json({ message: "RAWG_API_KEY is missing" }, { status: 500 })
    }

    const { searchParams } = req.nextUrl
    const countOnly = searchParams.get("countOnly") === "1"
    const page = Math.min(Math.max(Number(searchParams.get("page")) || 1, 1), 100)

    const params = buildRawgQuery(searchParams)
    params.set("key", apiKey)
    params.set("page", String(page))

    if (countOnly) params.set("page_size", "1")

    const response = await fetch(`https://api.rawg.io/api/games?${params}`)

    if (response.status === 404) {
        return NextResponse.json({ count: 0, results: [] })
    }

    if (!response.ok) {
        return NextResponse.json(
            { message: `RAWG request failed: HTTP ${response.status}` },
            { status: 502 }
        )
    }

    const data = await response.json()

    if (countOnly) {
        return NextResponse.json({ count: data.count })
    }

    return NextResponse.json({
        count: data.count,
        results: (data.results as RawgGame[]).map(mapRawgToGame),
    })
}