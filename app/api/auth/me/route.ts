import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { organizerProfiles, userProfiles, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InferInsertModel } from "drizzle-orm";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const payload = verifyToken(token);
        if (!payload || !payload.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.id))
            .execute();

        const user = userResult[0];

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = user;

        let profile = null;

        if (user.role === "USER") {
            const userProfileResult = await db
                .select()
                .from(userProfiles)
                .where(eq(userProfiles.userId, user.id))
                .execute();

            profile = userProfileResult[0] || null;
        } else if (user.role === "ORGANIZER") {
            const orgProfileResult = await db
                .select()
                .from(organizerProfiles)
                .where(eq(organizerProfiles.userId, user.id))
                .execute();

            profile = orgProfileResult[0] || null;
        }

        return NextResponse.json({
            success: true,
            user: userData, profile
        });
    } catch (error) {
        console.error("Failed to fetch user profile:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
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
        if (!payload || !payload.id) {
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
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const body = await req.json();

        type UserInsert = InferInsertModel<typeof users>;
        const userData: Partial<UserInsert> = {};
        const profileData: Record<string, unknown> = {};

        if (body.name) userData.name = body.name;
        if (body.email) userData.email = body.email;

        if (user.role === "ORGANIZER") {
            if (body.companyName) profileData.companyName = body.companyName;
            if (body.description) profileData.description = body.description;
        }

        let updatedUser = user;
        let updatedProfile = null;

        await db.transaction(async (tx) => {
            if (Object.keys(userData).length > 0) {
                const result = await tx
                    .update(users)
                    .set(userData)
                    .where(eq(users.id, user.id))
                    .returning()

                updatedUser = result[0];
            }

            if (user.role === "ORGANIZER" && Object.keys(profileData).length > 0) {
                const res = await tx
                    .update(organizerProfiles)
                    .set(profileData)
                    .where(eq(organizerProfiles.userId, user.id))
                    .returning();

                updatedProfile = res[0];
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restFields } = updatedUser;

        return NextResponse.json({
            success: true,
            user: restFields,
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Failed to update user profile:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
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
        if (!payload || !payload.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await db
            .delete(users)
            .where(eq(users.id, payload.id));

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete user and profile:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
