import { db } from "@/lib/db";
import { events, users, organizerProfiles } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const allEvents = await db
            .select({
                id: events.id,
                title: events.title,
                description: events.description,
                category: events.category,
                city: events.city,
                venue: events.venue,
                start_time: events.start_time,
                end_time: events.end_time,
                organizerName: users.name,
                organizerEmail: users.email,
                companyName: organizerProfiles.companyName,
            })
            .from(events)
            .leftJoin(users, eq(events.organizer_id, users.id))
            .leftJoin(organizerProfiles, eq(organizerProfiles.userId, users.id));

        return NextResponse.json({
            success: true,
            events: allEvents
        });
    } catch (error) {
        console.error("Failed to fetch All events:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}
