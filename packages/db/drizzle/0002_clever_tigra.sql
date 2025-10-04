ALTER TABLE "simulation_results" ADD COLUMN "requestId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "monthlyPensionGross" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "totalCapital" numeric(15, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "mainAccountCapital" numeric(15, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "subAccountCapital" numeric(15, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "averageLifeExpectancyMonths" numeric(6, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "retirementAge" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD COLUMN "yearlyBreakdown" jsonb;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD CONSTRAINT "simulation_results_requestId_simulation_requests_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."simulation_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_results" DROP COLUMN "test";