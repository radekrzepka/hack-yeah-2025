CREATE TABLE "simulation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "simulation_requests" ADD COLUMN "additionalData" jsonb;