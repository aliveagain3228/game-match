import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { isPrismaError} from "@/lib/prismaError";
import { registerSchema } from "@/lib/validations/auth"

export async function POST(req: NextRequest) {
    let body: unknown

    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
    }

    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
        const errorList = validation.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
        }))

        return NextResponse.json(
            { message: "Validation error", errors: errorList },
            { status: 400 }
        )
    }

    const { name, email, password } = validation.data

    try {
        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })

        return NextResponse.json(
            {
                message: "The user has been successfully created",
                user: newUser,
            },
            { status: 201 }
        )
    } catch (error) {
        if (isPrismaError(error, "P2002")) {
            return NextResponse.json(
                { message: "A user with that email address already exists" },
                { status: 409 }
            )
        }

        console.error("Error registering user", error)
        return NextResponse.json({ message: "Internal Error" }, { status: 500 })
    }
}