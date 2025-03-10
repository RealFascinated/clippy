CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"user_id" text NOT NULL,
	"storage_metrics" jsonb,
	"file_metrics" jsonb,
	"user_metrics" jsonb
);
--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_date_idx" ON "metrics" USING btree ("user_id","date");