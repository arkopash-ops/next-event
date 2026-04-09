import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { events, users } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;

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

        const event = await db
            .select()
            .from(events)
            .where(
                and(
                    eq(events.id, id),
                    eq(events.organizer_id, user.id)
                )
            );

        if (!event.length) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(event[0]);
    } catch (error) {
        console.error("Failed to fetch event:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch event",
        });
    }
}

export async function PATCH(
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

        const updated = await db
            .update(events)
            .set({
                title: body.title,
                description: body.description,
                category: body.category,
                city: body.city,
                venue: body.venue,
                start_time: body.start_time
                    ? new Date(body.start_time)
                    : undefined,
                end_time: body.end_time
                    ? new Date(body.end_time)
                    : undefined,
            })
            .where(
                and(
                    eq(events.id, id),
                    eq(events.organizer_id, user.id)
                )
            )
            .returning();

        if (!updated.length) {
            return NextResponse.json(
                { message: "Event not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error("Failed to update event:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to update event",
        });
    }
}

export async function DELETE(
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

        const deleted = await db
            .delete(events)
            .where(
                and(
                    eq(events.id, id),
                    eq(events.organizer_id, user.id)
                )
            )
            .returning();

        if (!deleted.length) {
            return NextResponse.json(
                { message: "Event not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Event deleted",
        });
    } catch (error) {
        console.error("Failed to delete event:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to delete event",
        });
    }
}