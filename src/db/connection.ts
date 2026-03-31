import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_VtGD8ZLS7fhF@ep-snowy-hat-aehohr08-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
});

export const db = drizzle(pool, {
  schema,
});
