import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(`DATABASE_URL is missing from your environment variables.`);
  process.exit(1);
}

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/lib/db/schemas/"],
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
