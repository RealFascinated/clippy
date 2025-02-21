import { env } from "@/lib/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/lib/db/schemas/"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
