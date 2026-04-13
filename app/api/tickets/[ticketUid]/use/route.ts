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
                { success: false, message: "Ticket already used" },
                { status: 400 }
            );
        }

        if (ticket.status === "EXPIRED") {
            return NextResponse.json(
                { success: false, message: "Cannot use Expired ticket." },
                { status: 400 }
            );
        }

        const updated = await db
            .update(tickets)
            .set({
                status: "USED",
                usedAt: new Date(),
            })
            .where(eq(tickets.ticketUid, ticketUid))
            .returning();

        return NextResponse.json({
            success: true,
            message: "Ticket marked as used",
            data: updated[0],
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
