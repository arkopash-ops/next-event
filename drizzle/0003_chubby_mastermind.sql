CREATE TYPE "public"."booking_status" AS ENUM('CONFIRMED', 'CANCELLED', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('UNUSED', 'USED', 'EXPIRED');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"show_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" numeric NOT NULL,
	"status" "booking_status" DEFAULT 'CONFIRMED' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "payment_status" DEFAULT 'SUCCESS' NOT NULL,
	"payment_method" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"show_id" uuid NOT NULL,
	"ticket_uid" text NOT NULL,
	"status" "ticket_status" DEFAULT 'UNUSED' NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tickets_ticket_uid_unique" UNIQUE("ticket_uid")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_show_id_event_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."event_shows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_show_id_event_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."event_shows"("id") ON DELETE cascade ON UPDATE no action;