import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 })

        const { targetId } = await req.json()

        const sender = await prisma.user.findUnique({ where: { email: session.user.email } });
        const receiver = await prisma.user.findUnique({ where: { id: targetId } });

        if (!sender || !receiver) {
            return new NextResponse("User not found", { status: 404 })
        }

        if (sender.id === receiver.id) {
            return new NextResponse("You cannot add yourself", { status: 400})
        }

        const existingRequest = await prisma.friendship.findFirst({
            where: {
                OR : [
                    { senderId: sender.id, receiverId: receiver.id },
                    { senderId: receiver.id, receiverId: sender.id}
                ]
            }
        })

        if (existingRequest) {
            return new NextResponse("Friend request already exists", { status: 400 })
        }

        const newFriendship = await prisma.friendship.create({
            data: {
                senderId: sender.id,
                receiverId: receiver.id
            }
        })

        return NextResponse.json(newFriendship)
    } catch (error) {
        console.error("Error adding friend", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 })

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                receivedFriendRequests: { include: { sender: true }},
                sentFriendRequests: { include: { receiver: true } }
            }
        })
        if (!user) return new NextResponse("User not found", { status: 404 })
        return NextResponse.json({
            myId: user.id,
            received: user.receivedFriendRequests,
            sent: user.sentFriendRequests
        })
    } catch (error) {
        console.error("Error fetching friends data", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 })
        const { requestId, action } = await req.json()

        if (action === 'ACCEPT') {
            const updated = await prisma.friendship.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED'}
            })
            return NextResponse.json(updated)
        } else if (action == 'DECLINE') {
            await prisma.friendship.delete({
                where: { id: requestId}
            })
            return NextResponse.json({ message: "Request declined" })
        }

        return new NextResponse("Invalid action", { status: 400 })
    } catch (error) {
        console.error("Error updating friend request", error)
        return new NextResponse("Internal Error", { status: 500})
    }
}