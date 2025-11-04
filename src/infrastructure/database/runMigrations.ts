import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export async function runMigrations(): Promise<void> {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/taskdb";
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    console.log("Running database migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

