import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { eventShows, events, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string; showId: string }> } // id = event, showId = show
) {
  try {
    const { id, showId } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });

    if (!user || user.role !== "ORGANIZER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    if (!event || event.organizer_id !== user.id) {
      return NextResponse.json({
        success: false,
        message: "You are not allowed to view shows for this event",
      }, { status: 403 });
    }

    const show = await db.query.eventShows.findFirst({
      where: eq(eventShows.id, showId),
    });

    if (!show || show.event_id !== event.id) {
      return NextResponse.json({ success: false, message: "Show not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, show }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch show:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch show",
    });
  }
}


export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string; showId: string }> }
) {
    try {
        const { id, showId } = await context.params;

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
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
        });

        if (!event || event.organizer_id !== user.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not allowed to update shows for this event",
                },
                { status: 403 }
            );
        }

        const show = await db.query.eventShows.findFirst({
            where: eq(eventShows.id, showId),
        });

        if (!show || show.event_id !== event.id) {
            return NextResponse.json(
                { success: false, message: "Show not found" },
                { status: 404 }
            );
        }

        const updatedShow = await db
            .update(eventShows)
            .set({
                show_time: body.show_time ? new Date(body.show_time) : show.show_time,
                total_seats: body.total_seats ?? show.total_seats,
                price: body.price ?? show.price,
            })
            .where(eq(eventShows.id, showId))
            .returning();

        return NextResponse.json({ success: true, show: updatedShow[0] }, { status: 200 });
    } catch (error) {
        console.error("Failed to update show:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update show",
        });
    }
}


export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string; showId: string }> }
) {
    try {
        const { id, showId } = await context.params;

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || !payload.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user || user.role !== "ORGANIZER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
        });

        if (!event || event.organizer_id !== user.id) {
            return NextResponse.json({
                success: false,
                message: "You are not allowed to delete shows for this event",
            }, { status: 403 });
        }

        const show = await db.query.eventShows.findFirst({
            where: eq(eventShows.id, showId),
        });

        if (!show || show.event_id !== event.id) {
            return NextResponse.json({ success: false, message: "Show not found" }, { status: 404 });
        }

        await db.delete(eventShows).where(eq(eventShows.id, showId));

        return NextResponse.json({ success: true, message: "Show deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete show:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete show",
        });
    }
}
