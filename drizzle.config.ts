import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error("Environment variable DB_URL is not set.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: dbUrl,
  },
});
