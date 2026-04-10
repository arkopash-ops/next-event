import { db } from "@/lib/db";
import { eventShows } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ eventId: string; showId: string }> }
) {
    try {
        const { eventId, showId } = await context.params;

        const show = await db.query.eventShows.findFirst({
            where: and(
                eq(eventShows.id, showId),
                eq(eventShows.event_id, eventId)
            ),
        });

        if (!show) {
            return NextResponse.json(
                { success: false, message: "Show not found for this event" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            show,
        });

    } catch (error) {
        console.error("Failed to fetch show:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch show" },
            { status: 500 }
        );
    }
}
