/**
 * Database Connection Pool Configuration
 * Activity 7 - Mulungushi University ICT251
 */

const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not defined in the environment. Set DATABASE_URL in .env before executing database queries.");
}

// Determine if SSL is required based on host or explicit environment variable
const isLocalhost = connectionString && (connectionString.includes("localhost") || connectionString.includes("127.0.0.1"));
const disableSSL = process.env.PGSSLMODE === "disable" || isLocalhost;

const pool = new Pool({
  connectionString: connectionString,
  ssl: disableSSL ? false : { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

module.exports = pool;
