import { db } from "@/lib/db";
import { userProfiles, users } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allUsersProfiles = await db
      .select({
        id: userProfiles.id,
        usersName: users.name,
        createdAt: userProfiles.createdAt,
      })
      .from(userProfiles)
      .leftJoin(users, eq(users.id, userProfiles.userId));

    return NextResponse.json({
      success: true,
      users: allUsersProfiles,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
