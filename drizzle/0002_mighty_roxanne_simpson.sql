CREATE TABLE "event_shows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"show_time" timestamp NOT NULL,
	"total_seats" integer NOT NULL,
	"available_seats" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_shows" ADD CONSTRAINT "event_shows_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;