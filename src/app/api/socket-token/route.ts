import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { SignJWT } from "jose"
import { authOptions } from "@/lib/auth"

export async function GET() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const secret = process.env.SOCKET_AUTH_SECRET

    if (!secret || secret.length < 32) {
        console.error("SOCKET_AUTH_SECRET is missing or shorter than 32 characters")
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }

    const token = await new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId)
        .setIssuer("gamematch-web")
        .setAudience("gamematch-socket")
        .setIssuedAt()
        .setExpirationTime("2m")
        .sign(new TextEncoder().encode(secret))

    return NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } })
}