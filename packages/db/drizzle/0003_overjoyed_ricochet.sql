CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"login" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "admin_login_unique" UNIQUE("login")
);
