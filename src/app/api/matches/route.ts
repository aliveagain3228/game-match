import { NextResponse } from "next/server";
import { getServerSession} from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const { gameId, gameName, gameImage } = await req.json()
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return new NextResponse("User not found", { status: 401 })
        const   existingMatch = await prisma.match.findFirst({
            where: { userId: user.id, gameId: Number(gameId) }
        })

        if (existingMatch) return NextResponse.json(existingMatch)

        const newMatch = await prisma.match.create({
            data : {
                userId: user.id,
                gameId: Number(gameId),
                gameName,
                gameImage
            }
        })
        return NextResponse.json(newMatch)
    } catch (error) {
        console.error("Error saving match", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return new NextResponse("Unauthorized", {status: 401})
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return new NextResponse("User not found", { status: 401})
        const matches = await prisma.match.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc'}
        })
        return NextResponse.json(matches)
    } catch (error) {
        console.error("Error fetching matches", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}