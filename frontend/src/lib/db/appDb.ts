import "server-only";

import { Pool } from "pg";

export const appDb = new Pool({
  host: process.env.APP_DB_HOST,
  port: Number(
    process.env.APP_DB_PORT ?? 5432
  ),
  database: process.env.APP_DB_NAME,
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,

  ssl: {
    rejectUnauthorized: false,
  },

  max: 5,
});