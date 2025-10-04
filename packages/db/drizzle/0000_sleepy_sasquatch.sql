CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"login" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "admin_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "simulation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"age" integer NOT NULL,
	"sex" "sex" NOT NULL,
	"grossSalary" integer NOT NULL,
	"workStartDate" date NOT NULL,
	"plannedRetirementYear" integer NOT NULL,
	"includeSickLeave" boolean DEFAULT false NOT NULL,
	"expectedPension" integer NOT NULL,
	"postalCode" varchar(10),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"additionalData" jsonb
);
--> statement-breakpoint
CREATE TABLE "simulation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requestId" uuid NOT NULL,
	"monthlyPensionGross" numeric(10, 2) NOT NULL,
	"totalCapital" numeric(15, 2) NOT NULL,
	"mainAccountCapital" numeric(15, 2) NOT NULL,
	"subAccountCapital" numeric(15, 2) NOT NULL,
	"averageLifeExpectancyMonths" numeric(6, 2) NOT NULL,
	"retirementAge" integer NOT NULL,
	"yearlyBreakdown" jsonb
);
--> statement-breakpoint
CREATE TABLE "testTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(128) NOT NULL,
	CONSTRAINT "testTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
--> statement-breakpoint
ALTER TABLE "simulation_results" ADD CONSTRAINT "simulation_results_requestId_simulation_requests_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."simulation_requests"("id") ON DELETE no action ON UPDATE no action;