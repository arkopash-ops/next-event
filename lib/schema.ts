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

export const bookingStatusEnum = pgEnum("booking_status", [
    "CONFIRMED",
    "CANCELLED",
    "PENDING"
]);

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    showId: uuid("show_id").notNull().references(() => eventShows.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    totalPrice: numeric("total_price").notNull(),
    status: bookingStatusEnum("status").notNull().default("CONFIRMED"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const ticketStatusEnum = pgEnum("ticket_status", [
    "UNUSED",
    "USED",
    "EXPIRED"
]);

export const tickets = pgTable("tickets", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    showId: uuid("show_id").notNull().references(() => eventShows.id, { onDelete: "cascade" }),
    ticketUid: text("ticket_uid").notNull().unique(),
    status: ticketStatusEnum("status").notNull().default("UNUSED"),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const paymentStatusEnum = pgEnum("payment_status", [
    "SUCCESS",
    "FAILED",
    "PENDING",
    "REFUNDED"
]);

export const payments = pgTable("payments", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: paymentStatusEnum("status").notNull().default("SUCCESS"),
    paymentMethod: text("payment_method"),
    createdAt: timestamp("created_at").defaultNow(),
});
