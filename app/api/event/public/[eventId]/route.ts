import { db } from "@/lib/db";
import { events, eventShows, organizerProfiles, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await context.params;

        const rows = await db
            .select({
                eventId: events.id,
                title: events.title,
                description: events.description,
                city: events.city,
                venue: events.venue,

                organizerName: users.name,
                organizerEmail: users.email,
                companyName: organizerProfiles.companyName,

                showId: eventShows.id,
                show_time: eventShows.show_time,
                total_seats: eventShows.total_seats,
                available_seats: eventShows.available_seats,
                price: eventShows.price,
            })
            .from(events)
            .leftJoin(users, eq(events.organizer_id, users.id))
            .leftJoin(organizerProfiles, eq(organizerProfiles.userId, users.id))
            .leftJoin(eventShows, eq(eventShows.event_id, events.id))
            .where(eq(events.id, eventId));

        if (!rows.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        const event = {
            id: rows[0].eventId,
            title: rows[0].title,
            city: rows[0].city,
            venue: rows[0].venue,

            organizerName: rows[0].organizerName,
            companyName: rows[0].companyName,

            shows: rows
                .filter(r => r.showId)
                .map(r => ({
                    id: r.showId,
                    show_time: r.show_time,
                    total_seats: r.total_seats,
                    available_seats: r.available_seats,
                    price: r.price,
                })),
        };

        return NextResponse.json({
            success: true,
            event,
        });

    } catch (error) {
        console.error("Failed to fetch event:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch event",
        });
    }
}