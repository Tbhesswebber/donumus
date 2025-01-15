import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dbCredentials: {
    url: process.env.DB_URL,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./app/db/schema.ts",
});
