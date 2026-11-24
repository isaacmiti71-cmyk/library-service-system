/**
 * Database Initialization Script
 * Runs schema.sql and conditionally runs seed.sql if the records table is empty.
 * Invoked via: npm run init-db
 */

const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function initDatabase() {
  console.log("=== Initializing Database for Library Service Requests ===");
  
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set. Please configure .env or pass DATABASE_URL in your environment.");
    process.exit(1);
  }

  try {
    // 1. Read and apply schema.sql
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    console.log("Applying schema from schema.sql...");
    await pool.query(schemaSql);
    console.log("Schema applied successfully: 'records' table is ready.");

    // 2. Check if records table already contains rows
    const countResult = await pool.query("SELECT COUNT(*) AS count FROM records;");
    const currentCount = parseInt(countResult.rows[0].count, 10);
    console.log(`Current record count in 'records' table: ${currentCount}`);

    if (currentCount === 0) {
      // 3. Table is empty: apply seed.sql
      const seedPath = path.join(__dirname, "..", "seed.sql");
      const seedSql = fs.readFileSync(seedPath, "utf-8");
      console.log("Table is empty. Seeding starting demonstration records from seed.sql...");
      await pool.query(seedSql);
      
      const newCountResult = await pool.query("SELECT COUNT(*) AS count FROM records;");
      console.log(`Seeding complete. Total records now in database: ${newCountResult.rows[0].count}`);
    } else {
      console.log("Table already contains records; skipping seed.sql to preserve existing data.");
    }

    console.log("=== Database Initialization Completed Successfully ===");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
