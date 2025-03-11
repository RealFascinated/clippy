CREATE TABLE "shortened_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"delete_key" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"clicks" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shortened_urls" ADD CONSTRAINT "shortened_urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;