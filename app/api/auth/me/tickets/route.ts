import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { bookings, tickets, eventShows, events } from "@/lib/schema";
import { GroupedBooking } from "@/types/booking";
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
            );
        }

        const payload = verifyToken(token);

        if (!payload?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await db
            .select({
                ticketId: tickets.id,
                ticketUid: tickets.ticketUid,
                ticketStatus: tickets.status,

                bookingId: bookings.id,
                quantity: bookings.quantity,
                totalPrice: bookings.totalPrice,

                eventName: events.title,
                showTime: eventShows.show_time,
                showId: eventShows.id,
            })
            .from(tickets)
            .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
            .innerJoin(eventShows, eq(tickets.showId, eventShows.id))
            .innerJoin(events, eq(eventShows.event_id, events.id))
            .where(eq(bookings.userId, payload.id))
            .execute();

        const grouped = result.reduce((acc, curr) => {
            const bookingId = curr.bookingId;

            if (!acc[bookingId]) {
                acc[bookingId] = {
                    bookingId: curr.bookingId,
                    eventName: curr.eventName,
                    showTime: curr.showTime,
                    showId: curr.showId,
                    totalPrice: curr.totalPrice,
                    quantity: curr.quantity,
                    tickets: [],
                };
            }

            acc[bookingId].tickets.push({
                id: curr.ticketId,
                ticketUid: curr.ticketUid,
                status: curr.ticketStatus,
            });

            return acc;
        }, {} as Record<string, GroupedBooking>);

        return NextResponse.json({
            success: true,
            tickets: Object.values(grouped),
        });
    } catch (error) {
        console.error("Failed to fetch tickets:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}