CREATE TABLE "gifts" (
	"created_at" timestamp NOT NULL,
	"created_by" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"hidden" boolean,
	"id" uuid PRIMARY KEY NOT NULL,
	"link" varchar(255),
	"list_id" uuid NOT NULL,
	"starred" boolean,
	"updated_at" timestamp NOT NULL
);
