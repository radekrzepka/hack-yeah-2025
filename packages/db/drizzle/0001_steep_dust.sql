CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "simulation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"age" integer NOT NULL,
	"sex" "sex" NOT NULL,
	"grossSalary" integer NOT NULL,
	"workStartDate" date NOT NULL,
	"plannedRetirementYear" integer NOT NULL,
	"includeSickLeave" boolean DEFAULT false NOT NULL
);
