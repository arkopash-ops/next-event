import { db } from "@/lib/db";
import { tickets } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await context.params;

        if (!bookingId) {
            return NextResponse.json(
                { success: false, message: "Missing bookingId" },
                { status: 400 }
            );
        }

        const ticketsList = await db.query.tickets.findMany({
            where: eq(tickets.bookingId, bookingId),
        });

        return NextResponse.json({
            success: true,
            tickets: ticketsList,
        });

    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { success: false, message: "Failed to fetch tickets" },
            { status: 500 }
        );
    }
}
