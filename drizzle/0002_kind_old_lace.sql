CREATE TABLE "thumbnail" (
	"thumbnail_id" text PRIMARY KEY NOT NULL,
	"thumbnail_extension" text NOT NULL,
	"thumbnail_size" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "file_thumbnail_id_unique";--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "has_thumbnail" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "thumbnail" ADD CONSTRAINT "thumbnail_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_id";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_extension";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_size";