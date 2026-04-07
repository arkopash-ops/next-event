import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
    "USER",
    "ORGANIZER",
    "ADMIN"
]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: userRoleEnum("role").notNull().default("USER"),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("users_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const organizerProfiles = pgTable("organizers_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").unique().notNull().references(() => users.id, { onDelete: "cascade" }),
    companyName: text("company_name"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});
