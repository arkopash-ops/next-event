import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { ne } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .where(ne(users.role, "ADMIN"));

    const usersWithoutPassword = allUsers.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...restFields }) => restFields,
    );

    return NextResponse.json({
      success: true,
      users: usersWithoutPassword,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
