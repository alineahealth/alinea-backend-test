import { Pool } from "pg";

const poolConnection: Pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: +(process.env.DB_MIN || 0),
  max: +(process.env.DB_MAX || 10),
});

export const pool = () => poolConnection;
