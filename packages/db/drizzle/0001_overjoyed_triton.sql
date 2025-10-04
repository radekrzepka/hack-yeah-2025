CREATE TABLE "chartsTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chart_name" varchar(255) NOT NULL,
	"chart_type" varchar(255) NOT NULL,
	"chart_data" jsonb NOT NULL,
	"source" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factsTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fact" varchar(3000) NOT NULL,
	"source" varchar(3000) NOT NULL,
	CONSTRAINT "factsTable_fact_unique" UNIQUE("fact")
);
