import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tickets } from "@/lib/schema";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ ticketUid: string }> }
) {
    try {
        const { ticketUid } = await params;

        const ticket = await db.query.tickets.findFirst({
            where: (t, { eq }) => eq(t.ticketUid, ticketUid),
        });

        if (!ticket) {
            return NextResponse.json(
                { success: false, message: "Ticket not found" },
                { status: 404 }
            );
        }

        if (ticket.status === "USED") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Ticket already used, cannot be expired",
                },
                { status: 400 }
            );
        }

        if (ticket.status === "EXPIRED") {
            return NextResponse.json({
                success: true,
                message: "Ticket already expired",
                data: ticket,
            });
        }

        const updated = await db
            .update(tickets)
            .set({
                status: "EXPIRED",
            })
            .where(eq(tickets.ticketUid, ticketUid))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Ticket marked as expired",
            data: updated[0],
        });
    } catch (error) {
        console.error("Expire ticket error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
