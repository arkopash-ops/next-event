import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { bookings, events, eventShows, organizerProfiles, tickets, userProfiles, users } from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
    schema: { users, userProfiles, organizerProfiles, events, eventShows, bookings, tickets }
});
