CREATE TYPE "public"."family_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "families" (
	"created_at" timestamp NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"auth_id" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"email" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users_to_families" (
	"created_at" timestamp NOT NULL,
	"family_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "family_role" NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
ALTER TABLE "users_to_families" ADD CONSTRAINT "users_to_families_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_families" ADD CONSTRAINT "users_to_families_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "family_to_user_index" ON "users_to_families" USING btree ("family_id","user_id");