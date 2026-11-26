import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Prisma } from "@/generated/prisma/client"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { isPrismaError} from "@/lib/prismaError";
import {
    sendFriendRequestSchema,
    respondFriendRequestSchema,
} from "@/lib/validations/friends"

const publicUserSelect = {
    id: true,
    name: true,
    image: true,
} satisfies Prisma.UserSelect

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        const currentUserId = session?.user?.id

        if (!currentUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: {
                id: true,
                receivedFriendRequests: {
                    include: { sender: { select: publicUserSelect } },
                },
                sentFriendRequests: {
                    include: { receiver: { select: publicUserSelect } },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            myId: user.id,
            received: user.receivedFriendRequests,
            sent: user.sentFriendRequests,
        })
    } catch (error) {
        console.error("Error fetching friends data", error)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const senderId = session?.user?.id

        if (!senderId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json().catch(() => null)
        const parsed = sendFriendRequestSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid request data", errors: parsed.error.issues },
                { status: 400 }
            )
        }

        const { targetId } = parsed.data

        if (senderId === targetId) {
            return NextResponse.json(
                { message: "You cannot add yourself" },
                { status: 400 }
            )
        }

        const [receiver, existingRequest] = await Promise.all([
            prisma.user.findUnique({
                where: { id: targetId },
                select: { id: true },
            }),
            prisma.friendship.findFirst({
                where: {
                    OR: [
                        { senderId, receiverId: targetId },
                        { senderId: targetId, receiverId: senderId },
                    ],
                },
            }),
        ])

        if (!receiver) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        if (existingRequest) {
            return NextResponse.json(
                { message: "Friend request already exists" },
                { status: 409 }
            )
        }

        const newFriendship = await prisma.friendship.create({
            data: {
                senderId,
                receiverId: targetId,
            },
        })

        return NextResponse.json(newFriendship, { status: 201 })
    } catch (error) {
        if (isPrismaError(error, "P2002")) {
            return NextResponse.json(
                { message: "Friend request already exists" },
                { status: 409 }
            )
        }

        console.error("Error adding friend", error)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const currentUserId = session?.user?.id

        if (!currentUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json().catch(() => null)
        const parsed = respondFriendRequestSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid action or request ID", errors: parsed.error.issues },
                { status: 400 }
            )
        }

        const { requestId, action } = parsed.data

        if (action === "ACCEPT") {
            const updated = await prisma.friendship.update({
                where: {
                    id: requestId,
                    receiverId: currentUserId,
                    status: "PENDING",
                },
                data: { status: "ACCEPTED" },
            })

            return NextResponse.json(updated)
        }

        await prisma.friendship.delete({
            where: {
                id: requestId,
                receiverId: currentUserId,
                status: "PENDING",
            },
        })

        return NextResponse.json({ message: "Request declined" })
    } catch (error) {
        if (isPrismaError(error, "P2025")) {
            return NextResponse.json(
                { message: "Pending friend request not found" },
                { status: 404 }
            )
        }

        console.error("Error updating friend request", error)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}