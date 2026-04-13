import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import {
    bookings,
    events,
    eventShows,
    payments,
    tickets,
    users,
} from "@/lib/schema";
import { count, eq, gt } from "drizzle-orm";
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

        const admin = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!admin || admin.role !== "ADMIN") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const now = new Date();

        const [
            totalUsersResult,
            totalOrganizersResult,
            totalEventsResult,
            upcomingShowsResult,
            confirmedBookingsResult,
            usedTicketsResult,
            failedPaymentsResult,
            refundedPaymentsResult,
        ] = await Promise.all([
            db.select({ count: count() }).from(users).where(eq(users.role, "USER")),
            db.select({ count: count() }).from(users).where(eq(users.role, "ORGANIZER")),
            db.select({ count: count() }).from(events),
            db.select({ count: count() }).from(eventShows).where(gt(eventShows.show_time, now)),
            db.select({ count: count() }).from(bookings).where(eq(bookings.status, "CONFIRMED")),
            db.select({ count: count() }).from(tickets).where(eq(tickets.status, "USED")),
            db.select({ count: count() }).from(payments).where(eq(payments.status, "FAILED")),
            db.select({ count: count() }).from(payments).where(eq(payments.status, "REFUNDED")),
        ]);

        return NextResponse.json({
            success: true,
            overview: {
                totalUsers: totalUsersResult[0]?.count ?? 0,
                totalOrganizers: totalOrganizersResult[0]?.count ?? 0,
                totalEvents: totalEventsResult[0]?.count ?? 0,
                upcomingShows: upcomingShowsResult[0]?.count ?? 0,
                confirmedBookings: confirmedBookingsResult[0]?.count ?? 0,
                usedTickets: usedTicketsResult[0]?.count ?? 0,
                failedPayments: failedPaymentsResult[0]?.count ?? 0,
                refundedPayments: refundedPaymentsResult[0]?.count ?? 0,
            },
        });
    } catch (error) {
        console.error("Failed to fetch admin overview:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch admin overview" },
            { status: 500 }
        );
    }
}
