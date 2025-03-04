CREATE TABLE "thumbnail" (
	"thumbnail_id" text PRIMARY KEY NOT NULL,
	"thumbnail_extension" text,
	"thumbnail_size" integer
);
--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "file_thumbnail_id_unique";--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "has_thumbnail" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_id";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_extension";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "thumbnail_size";