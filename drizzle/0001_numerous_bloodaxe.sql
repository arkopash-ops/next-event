CREATE TYPE "public"."event_category" AS ENUM('MOVIE', 'COMEDY', 'SPORTS', 'WORKSHOP', 'PLAY', 'ACTIVITY');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" "event_category",
	"organizer_id" uuid NOT NULL,
	"city" text NOT NULL,
	"venue" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;