# Activity 7: Library Service Requests Backend API

**Course:** ICT251 Introduction to Web Technologies  
**Institution:** Mulungushi University  
**Department:** Computer Science Department, School of Engineering and Technology  
**Student Name:** ISAAC MITI  
**Student Number:** 202509238  

---

## 1. Overview

The **Library Service Requests API** is an independent, production-ready Node.js REST API built using **Express** and **PostgreSQL** (`pg`). It manages persistent records for library assistance requests, applying server-side validation, parameterized SQL queries, structured error handling, CORS headers, and an interactive marker documentation guide.

---

## 2. File Structure

```
activity7-backend/
├── routes/
│   └── records.js           # REST CRUD route handlers for /api/records
├── scripts/
│   └── init-db.js           # Database init script: runs schema.sql and seed.sql
├── .env                     # Local environment settings (git-ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Excludes node_modules, .env, and logs from Git
├── db.js                    # PostgreSQL connection pool with automated SSL detection
├── package.json             # Express, cors, dotenv, pg dependencies & npm scripts
├── postman_collection.json  # Postman collection for manual and automated API tests
├── README.md                # Local setup, hosted database, and Render deployment guide
├── schema.sql               # PostgreSQL schema definition with CHECK constraints
├── seed.sql                 # 8 made-up demonstration library service requests
├── server.js                # Express app, CORS, / guide, /health, error middleware
└── TESTING.md               # Curl commands and expected status code reference
```

---

## 3. Database Setup: Free Hosted PostgreSQL (Neon)

To ensure persistent storage that survives server restarts and sleeps on Render:

1. Visit [Neon Console](https://neon.tech/) and create a free account.
2. Click **Create Project**. Name it `mulungushi-library-db`.
3. In the project dashboard, locate the **Connection Details** widget.
4. Select **Postgres** and check **Pooled connection** or standard connection.
5. Copy the connection string. It will look like:
   ```
   postgresql://username:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. Open your local `.env` file in `activity7-backend/` and paste this string into `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://username:password@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   CLIENT_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,https://your-frontend.netlify.app
   PORT=3000
   ```

---

## 4. Local Installation & Running

Open a terminal inside the `activity7-backend` directory and run:

```bash
# 1. Install dependencies
npm install

# 2. Initialize database schema and insert 8 initial records (runs only if empty)
npm run init-db

# 3. Start the Express server
npm start
```

Once started, open `http://localhost:3000` in your browser. You will see the marker API documentation page. Click the `/health` link to verify that the database connection is live (`status: healthy`).

---

## 5. Step-by-Step Render Deployment

Follow these steps to host your backend on [Render](https://render.com/):

### Step A: Push to GitHub
1. Initialize Git in the project root if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ICT251 Library Service Requests backend"
   ```
2. Create a new GitHub repository (e.g. `ict251-library-system`).
3. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/[YOUR-GITHUB-USERNAME]/ict251-library-system.git
   git branch -M main
   git push -u origin main
   ```

### Step B: Create a Web Service on Render
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name:** `mulungushi-library-api` (or a name of your choice)
   - **Region:** Frankfurt (EU Central) or Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `activity7-backend` (if repo root contains all activities)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL`: *(Your Neon connection string from Section 3)*
   - `CLIENT_ORIGINS`: `http://localhost:5500,http://127.0.0.1:5500,https://your-activity8-app.netlify.app`
     *(You can add your Netlify domain now or update it after Activity 8 is published)*
6. Click **Create Web Service**.
7. Render will build and deploy your API. Once deployed, note your assigned HTTPS service URL (e.g., `https://mulungushi-library-api.onrender.com`).

### Step C: Initialize the Database on Neon
Since your local machine connects to the same Neon database, running:
```bash
npm run init-db
```
from your local terminal with the Neon `DATABASE_URL` in `.env` will initialize the tables and seed records directly in the hosted database!

### Step D: Verification
Open `https://your-backend.onrender.com/` in your browser:
- You should see the complete styled API guide.
- Check `https://your-backend.onrender.com/health` &rarr; returns `{"status":"healthy","database":"connected"}`.
- Check `https://your-backend.onrender.com/api/records` &rarr; returns the 8 seeded JSON records.
- Submit this live base URL for Activity 7.
