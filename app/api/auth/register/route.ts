import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { organizerProfiles, userProfiles, users } from "@/lib/schema";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role: role || "USER",
            })
            .returning();

        if (newUser.role === "USER") {
            await db.insert(userProfiles).values({
                userId: newUser.id,
            });
        }

        if (newUser.role === "ORGANIZER") {
            await db.insert(organizerProfiles).values({
                userId: newUser.id,
            });
        }

        const token = signToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        const response = NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );

        // Set HTTP-only cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}