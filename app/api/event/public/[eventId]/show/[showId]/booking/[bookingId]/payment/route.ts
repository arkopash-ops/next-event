import { db } from "@/lib/db";
import { bookings, eventShows, payments, tickets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    context: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await context.params;

        const result = await db.transaction(async (tx) => {

            // get booking
            const booking = await tx.query.bookings.findFirst({
                where: eq(bookings.id, bookingId),
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.status === "CONFIRMED") {
                throw new Error("Already confirmed");
            }

            // get show
            const show = await tx.query.eventShows.findFirst({
                where: eq(eventShows.id, booking.showId),
            });

            if (!show) {
                throw new Error("Show not found");
            }

            // reduce seats
            await tx.update(eventShows)
                .set({
                    available_seats: show.available_seats - booking.quantity
                })
                .where(eq(eventShows.id, show.id));

            // create payment
            await tx.insert(payments).values({
                bookingId: booking.id,
                amount: booking.totalPrice,
                status: "SUCCESS",
                paymentMethod: "DEMO",
            });

            // confirm booking
            await tx.update(bookings)
                .set({ status: "CONFIRMED" })
                .where(eq(bookings.id, booking.id));

            // generate tickets
            const ticketsData = Array.from({ length: booking.quantity }).map(() => ({
                bookingId: booking.id,
                showId: booking.showId,
                ticketUid: crypto.randomUUID(),
            }));

            await tx.insert(tickets).values(ticketsData);

            // return updated booking
            return await tx.query.bookings.findFirst({
                where: eq(bookings.id, booking.id),
            });
        });

        return NextResponse.json({
            success: true,
            booking: result,
        });

    } catch (error: unknown) {
        console.error("Payment failed:", error);

        if (error instanceof Error) {
            if (error.message === "Booking not found") {
                return NextResponse.json(
                    { success: false, message: "Booking not found" },
                    { status: 404 }
                );
            }

            if (error.message === "Show not found") {
                return NextResponse.json(
                    { success: false, message: "Show not found" },
                    { status: 404 }
                );
            }

            if (error.message === "Already confirmed") {
                return NextResponse.json(
                    { success: false, message: "Booking already confirmed" },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Payment failed" },
            { status: 500 }
        );
    }
}