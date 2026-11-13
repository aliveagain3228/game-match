import { NextResponse, NextRequest } from "next/server";
import { getServerSession} from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMatchSchema } from "@/lib/validations/matches"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const currentUserId = session?.user?.id

        if (!currentUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const matches = await prisma.match.findMany({
            where: { userId: currentUserId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(matches)
    } catch (error) {
        console.error("Error fetching matches", error)
        return NextResponse.json({ message: "Internal Error"}, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id

        if (!currentUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json().catch(() => null)
        const parsed = createMatchSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid request data", errors: parsed.error.issues },
                { status: 400 }
            )
        }

        const { gameId, gameName, gameImage } = parsed.data
        const existingMatch = await prisma.match.findFirst({
            where: {
                userId: currentUserId,
                gameId
            }
        })

        if (existingMatch) {
            return NextResponse.json(existingMatch, { status: 200 })
        }

        const newMatch = await prisma.match.create({
            data: {
                userId: currentUserId,
                gameId,
                gameName,
                gameImage: gameImage || null
            }
        })
        return NextResponse.json(newMatch)
    } catch (error) {
        console.error("Error saving match", error)
        return NextResponse.json("Internal Error", { status: 500 })
    }
}

