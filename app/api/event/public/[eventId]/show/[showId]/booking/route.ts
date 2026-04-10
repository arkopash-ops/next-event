import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { users, eventShows, bookings } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
    req: Request,
    context: { params: Promise<{ eventId: string; showId: string }> }
) {
    try {
        const { eventId, showId } = await context.params;

        const body = await req.json();
        const { quantity } = body;

        if (!quantity || quantity <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid quantity" },
                { status: 400 }
            );
        }

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

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const booking = await db.transaction(async (tx) => {
            // validate show belongs to event
            const show = await tx.query.eventShows.findFirst({
                where: and(
                    eq(eventShows.id, showId),
                    eq(eventShows.event_id, eventId)
                ),
            });

            if (!show) {
                throw new Error("Show not found");
            }

            if (show.available_seats < quantity) {
                throw new Error("Housefull");
            }

            const totalPrice = Number(show.price) * quantity;

            const [newBooking] = await tx.insert(bookings).values({
                userId: user.id,
                showId,
                quantity,
                totalPrice: totalPrice.toString(),
                status: "PENDING",
            }).returning();

            return newBooking;
        });

        return NextResponse.json({
            success: true,
            booking,
        });

    } catch (error: unknown) {
        console.error("Booking failed:", error);
        if (error instanceof Error) {
            if (error.message === "Housefull") {
                return NextResponse.json(
                    { success: false, message: "No seats available" },
                    { status: 409 }
                );
            }

            if (error.message === "Show not found") {
                return NextResponse.json(
                    { success: false, message: "Show not found" },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
