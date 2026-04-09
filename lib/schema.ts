import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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


export const eventCategoryEnum = pgEnum("event_category", [
    "MOVIE",
    "COMEDY",
    "SPORTS",
    "WORKSHOP",
    "PLAY",
    "ACTIVITY"
]);

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    category: eventCategoryEnum("category"),
    organizer_id: uuid("organizer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    city: text("city").notNull(),
    venue: text("venue").notNull(),
    start_time: timestamp("start_time").notNull(),
    end_time: timestamp("end_time").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const eventShows = pgTable("event_shows", {
    id: uuid("id").primaryKey().defaultRandom(),
    event_id: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    show_time: timestamp("show_time").notNull(),
    total_seats: integer("total_seats").notNull(),
    available_seats: integer("available_seats").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
