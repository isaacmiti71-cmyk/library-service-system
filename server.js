/**
 * Express Server - Library Service Requests API
 * Activity 7 - Mulungushi University ICT251
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Parse and configure CORS permitted origins
const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length > 0 ? origins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

/**
 * Route: GET /
 * Purpose: Marker API documentation guide with interactive links and specifications
 */
app.get("/", (req, res) => {
  const host = req.get("host");
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Library Service Requests API | Marker Guide</title>
  <style>
    :root {
      --primary: #1e3a8a;
      --secondary: #334155;
      --accent: #0284c7;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #cbd5e1;
      --code-bg: #0f172a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--secondary);
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
      padding: 2.5rem;
    }
    header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    h1 { color: var(--primary); font-size: 1.85rem; margin-bottom: 0.5rem; }
    .badge {
      display: inline-block;
      background-color: var(--accent);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .meta-box {
      background-color: #eff6ff;
      border-left: 4px solid var(--accent);
      padding: 1rem 1.25rem;
      border-radius: 0 6px 6px 0;
      margin: 1rem 0;
    }
    .meta-box p { margin: 0.25rem 0; font-size: 0.95rem; }
    .notice {
      background-color: #fef3c7;
      border-left: 4px solid #d97706;
      padding: 1rem 1.25rem;
      border-radius: 0 6px 6px 0;
      margin: 1.5rem 0;
      color: #92400e;
    }
    h2 { color: var(--primary); font-size: 1.3rem; margin: 1.75rem 0 0.75rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 0.9rem;
    }
    th, td {
      text-align: left;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
    }
    th { background-color: #f1f5f9; color: var(--primary); font-weight: 700; }
    .method {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
    }
    .get { background-color: #0284c7; }
    .post { background-color: #16a34a; }
    .put { background-color: #d97706; }
    .delete { background-color: #dc2626; }
    pre {
      background-color: var(--code-bg);
      color: #f8fafc;
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.85rem;
      margin: 1rem 0;
    }
    a { color: var(--accent); text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .quick-links {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }
    .link-pill {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">ICT251 Activity 7</span>
      <h1>Library Service Requests API Guide</h1>
      <p>Independent Node.js + Express + PostgreSQL REST API for tracking academic library help requests.</p>
    </header>

    <div class="meta-box">
      <p><strong>Institution:</strong> Mulungushi University &bull; School of Engineering and Technology</p>
      <p><strong>Department:</strong> Department of Computer Science</p>
      <p><strong>Course:</strong> ICT251 Introduction to Web Technologies</p>
      <p><strong>Student Name:</strong> ISAAC MITI</p>
      <p><strong>Student Number:</strong> 202509238</p>
      <p><strong>Base Service URL:</strong> <code>${baseUrl}</code></p>
    </div>

    <div class="notice">
      <strong>Note for Markers:</strong> Render free web services automatically spin down into sleep mode after periods of inactivity. If this is the initial request after being idle, the service may take 30 to 50 seconds to complete its cold-boot startup.
    </div>

    <h2>Direct Test Endpoints</h2>
    <div class="quick-links">
      <a class="link-pill" href="/health" target="_blank">&rarr; Test Database Health (/health)</a>
      <a class="link-pill" href="/api/records" target="_blank">&rarr; Fetch All Records (/api/records)</a>
    </div>

    <h2>API Routes Specification</h2>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Route</th>
          <th>Purpose</th>
          <th>Success Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="method get">GET</span></td>
          <td><code>/</code></td>
          <td>Marker API documentation guide (this page)</td>
          <td>200 OK (HTML)</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td><code>/health</code></td>
          <td>Database health check (SELECT 1)</td>
          <td>200 OK / 503 JSON</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td><code>/api/records</code></td>
          <td>Read all records ordered by ID</td>
          <td>200 OK (JSON array)</td>
        </tr>
        <tr>
          <td><span class="method get">GET</span></td>
          <td><code>/api/records/:id</code></td>
          <td>Read one record by positive whole number ID</td>
          <td>200 OK (JSON object)</td>
        </tr>
        <tr>
          <td><span class="method post">POST</span></td>
          <td><code>/api/records</code></td>
          <td>Create a new library service request</td>
          <td>201 Created (JSON object)</td>
        </tr>
        <tr>
          <td><span class="method put">PUT</span></td>
          <td><code>/api/records/:id</code></td>
          <td>Update all 4 fields of an existing record</td>
          <td>200 OK (JSON object)</td>
        </tr>
        <tr>
          <td><span class="method delete">DELETE</span></td>
          <td><code>/api/records/:id</code></td>
          <td>Delete record by ID</td>
          <td>200 OK ({"message":"..."})</td>
        </tr>
      </tbody>
    </table>

    <h2>Shared Data Agreement &amp; Validation Rules</h2>
    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Type</th>
          <th>Rules &amp; Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>id</code></td>
          <td>Integer</td>
          <td>Positive whole number. Database-generated; non-editable. Ignored on POST.</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td>String</td>
          <td>3 to 80 characters after trimming.</td>
        </tr>
        <tr>
          <td><code>category</code></td>
          <td>String</td>
          <td>2 to 40 characters after trimming (e.g. Book search, Borrowing, Account help).</td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td>String</td>
          <td>5 to 300 characters after trimming.</td>
        </tr>
        <tr>
          <td><code>status</code></td>
          <td>String</td>
          <td>Exactly one of: <code>"Pending"</code>, <code>"In progress"</code>, <code>"Completed"</code></td>
        </tr>
      </tbody>
    </table>

    <h2>Sample Request Payload (POST / PUT)</h2>
    <pre>{
  "title": "Find a database textbook",
  "category": "Book search",
  "description": "I need help locating Fundamentals of Database Systems 7th Edition by Elmasri.",
  "status": "Pending"
}</pre>

    <h2>HTTP Status Codes Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Status Code</th>
          <th>Scenario</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>200 OK</strong></td><td>Successful read, update, or deletion.</td></tr>
        <tr><td><strong>201 Created</strong></td><td>Successful creation of a new service request record.</td></tr>
        <tr><td><strong>400 Bad Request</strong></td><td>Invalid field lengths, wrong data types, invalid status, or invalid non-integer ID.</td></tr>
        <tr><td><strong>404 Not Found</strong></td><td>Requested record ID does not exist or unmapped route accessed.</td></tr>
        <tr><td><strong>500 Server Error</strong></td><td>Unexpected server failure.</td></tr>
        <tr><td><strong>503 Service Unavailable</strong></td><td>Database failed to respond during <code>/health</code> check.</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

  res.status(200).send(html);
});

/**
 * Route: GET /health
 * Purpose: Verify server execution and database connectivity
 * Status: 200 OK | 503 Service Unavailable
 */
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1;");
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check error connecting to database:", error.message);
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      message: "Database failed to respond."
    });
  }
});

// Mount Records Router
app.use("/api/records", require("./routes/records"));

// Final Handler for Unmatched / Unknown Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Four-Parameter Centralized Error Handling Middleware
app.use((error, req, res, next) => {
  // Handle malformed JSON body errors
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON payload in request body." });
  }

  // Log unexpected errors on server
  console.error("Unexpected server failure:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port} at 0.0.0.0`);
});
