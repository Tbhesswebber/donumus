CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"last_change" timestamp NOT NULL,
	"name" varchar(255) NOT NULL,
	"personal" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lists_to_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"list_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
