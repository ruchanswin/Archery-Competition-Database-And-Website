import { Pool } from "pg";

let pool: Pool | undefined;

export function getDatabasePool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }

    let databaseUrl: URL;
    try {
      databaseUrl = new URL(connectionString);
    } catch {
      throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL");
    }
    if (databaseUrl.protocol !== "postgres:" && databaseUrl.protocol !== "postgresql:") {
      throw new Error("DATABASE_URL must use the postgres:// or postgresql:// protocol");
    }

    pool = new Pool({
      connectionString,
      max: 10,
      ssl: { rejectUnauthorized: true },
    });
  }

  return pool;
}
