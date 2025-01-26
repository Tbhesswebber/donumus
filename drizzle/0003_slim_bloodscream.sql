CREATE TYPE "public"."gift_status" AS ENUM('gone', 'partially_gone', 'looking', 'available');--> statement-breakpoint
CREATE TABLE "statuses" (
	"created_by" uuid NOT NULL,
	"gift_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"note" varchar(255),
	"status" "gift_status" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
