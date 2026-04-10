import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { events, eventShows, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
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
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
        });

        if (!event || event.organizer_id !== user.id) {
            return NextResponse.json(
                { message: "You are not allowed to add shows to this event" },
                { status: 403 }
            );
        }

        const shows = await db.query.eventShows.findMany({
            where: eq(eventShows.event_id, id),
        });

        return NextResponse.json({
            success: true,
            event,
            shows,
        });
    } catch (error) {
        console.error("Failed to fetch show for events:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch show for events",
        });
    }
}

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
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
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
        });

        if (!event || event.organizer_id !== user.id) {
            return NextResponse.json(
                { message: "You are not allowed to add shows to this event" },
                { status: 403 }
            );
        }

        const newShow = await db
            .insert(eventShows)
            .values({
                event_id: id,
                show_time: new Date(body.show_time),
                total_seats: body.total_seats,
                available_seats: body.total_seats,
                price: body.price,
            })
            .returning();

        return NextResponse.json(
            { success: true, show: newShow[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create show for events:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to create show for events",
        });
    }
}
