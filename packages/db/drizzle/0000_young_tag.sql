CREATE TABLE "testTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(128) NOT NULL,
	CONSTRAINT "testTable_email_unique" UNIQUE("email")
);
