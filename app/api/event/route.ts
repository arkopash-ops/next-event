import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { events, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const payload = verifyToken(token);
        if (!payload || !payload.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user || user.role !== "ORGANIZER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const organizerEvents = await db
            .select()
            .from(events)
            .where(eq(events.organizer_id, user.id));

        return NextResponse.json({
            success: true,
            events: organizerEvents
        });
    } catch (error) {
        console.error("Failed to fetch events:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch events",
        });
    }
}


export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const payload = verifyToken(token);
        if (!payload || !payload.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user || user.role !== "ORGANIZER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const newEvent = await db
            .insert(events)
            .values({
                title: body.title,
                description: body.description,
                category: body.category,
                organizer_id: user.id,
                city: body.city,
                venue: body.venue,
                start_time: new Date(body.start_time),
                end_time: new Date(body.end_time),
            })
            .returning();

        return NextResponse.json(
            { success: true, event: newEvent[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create events:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to create events",
        });
    }
}
