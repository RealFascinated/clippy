import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const preferencesTable = pgTable("preferences", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id)
		.unique(),

	// Preferences
	showKitty: boolean("show_kitty"),
	webhookUrl: text("webhook_url"),
});

export type PreferencesType = typeof preferencesTable.$inferSelect;
