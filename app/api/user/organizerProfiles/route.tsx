import { db } from "@/lib/db";
import { organizerProfiles, users } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allOrganizersProfiles = await db
      .select({
        id: organizerProfiles.id,
        usersName: users.name,
        companyName: organizerProfiles.companyName,
        description: organizerProfiles.description,
        createdAt: organizerProfiles.createdAt,
      })
      .from(organizerProfiles)
      .leftJoin(users, eq(users.id, organizerProfiles.userId));

    return NextResponse.json({
      success: true,
      users: allOrganizersProfiles,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
