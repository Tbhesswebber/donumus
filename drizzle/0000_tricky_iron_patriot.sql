CREATE TABLE "users" (
	"auth_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
