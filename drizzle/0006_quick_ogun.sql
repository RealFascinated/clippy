ALTER TABLE "preferences" ALTER COLUMN "notifications" SET DEFAULT '{"uploadFile":{"sendWebhook":true,"sendMail":true},"deleteFile":{"sendWebhook":true,"sendMail":true},"resetUploadToken":{"sendWebhook":true,"sendMail":true}}'::jsonb;--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "favorited" boolean DEFAULT false;