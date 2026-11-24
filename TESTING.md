# API Testing Guide - Library Service Requests (Activity 7)

This document provides terminal `curl` commands to test and verify every endpoint, validation rule, error response, and persistence feature of the Activity 7 backend API.

---

## Environment Setup
Set your target base URL (local development or live Render host):
```bash
# For Local Testing
BASE_URL="http://localhost:3000"

# For Live Hosted Testing
# BASE_URL="https://your-backend.onrender.com"
```

---

## Test Suite Execution

### 1. GET / (API Guide)
Verifies that the marker documentation page loads as HTML.
```bash
curl -i -X GET "$BASE_URL/"
```
**Expected Status:** `200 OK`  
**Content-Type:** `text/html; charset=utf-8`

---

### 2. GET /health (Database Connectivity Check)
Verifies that PostgreSQL responds to `SELECT 1`.
```bash
curl -i -X GET "$BASE_URL/health"
```
**Expected Status:** `200 OK`  
**Response Body:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-11-18T12:00:00.000Z"
}
```

---

### 3. GET /api/records (Read All Records)
Retrieves all records ordered by ID ascending.
```bash
curl -i -X GET "$BASE_URL/api/records"
```
**Expected Status:** `200 OK`  
**Response Body:** JSON array with 8+ records.

---

### 4. POST /api/records (Create Valid Record)
Creates a new library service request. Any client-sent `id` is ignored.
```bash
curl -i -X POST "$BASE_URL/api/records" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Find machine learning algorithms handbook",
    "category": "Book search",
    "description": "Student requires reference copy for ICT251 research project.",
    "status": "Pending"
  }'
```
**Expected Status:** `201 Created`  
**Response Body:**
```json
{
  "id": 9,
  "title": "Find machine learning algorithms handbook",
  "category": "Book search",
  "description": "Student requires reference copy for ICT251 research project.",
  "status": "Pending"
}
```

---

### 5. GET /api/records/:id (Read One Record)
Fetches the record created above (e.g., ID 9).
```bash
curl -i -X GET "$BASE_URL/api/records/9"
```
**Expected Status:** `200 OK`  
**Response Body:** Returns the single record object matching ID 9.

---

### 6. PUT /api/records/:id (Update Record)
Replaces all four editable fields while preserving the original ID.
```bash
curl -i -X PUT "$BASE_URL/api/records/9" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Find machine learning algorithms handbook (Located)",
    "category": "Book search",
    "description": "Handbook moved to reserve desk for 2-hour student loan.",
    "status": "In progress"
  }'
```
**Expected Status:** `200 OK`  
**Response Body:** Returns updated record with original ID 9.

---

### 7. DELETE /api/records/:id (Delete Record)
Removes the record by ID.
```bash
curl -i -X DELETE "$BASE_URL/api/records/9"
```
**Expected Status:** `200 OK`  
**Response Body:**
```json
{
  "message": "Record deleted."
}
```

---

### 8. GET /api/records/:id for Deleted Record (Expect 404)
Ensures record was deleted from PostgreSQL.
```bash
curl -i -X GET "$BASE_URL/api/records/9"
```
**Expected Status:** `404 Not Found`  
**Response Body:**
```json
{
  "message": "Record not found."
}
```

---

### 9. POST Invalid Payload (Missing / Too Short Title) -> Expect 400
```bash
curl -i -X POST "$BASE_URL/api/records" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ab",
    "category": "Borrowing",
    "description": "Valid description length test.",
    "status": "Pending"
  }'
```
**Expected Status:** `400 Bad Request`  
**Response Body:**
```json
{
  "message": "Title must have 3 to 80 characters."
}
```

---

### 10. POST Invalid Payload (Invalid Status) -> Expect 400
```bash
curl -i -X POST "$BASE_URL/api/records" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Valid title text",
    "category": "Borrowing",
    "description": "Valid description length test.",
    "status": "InvalidStatusName"
  }'
```
**Expected Status:** `400 Bad Request`  
**Response Body:**
```json
{
  "message": "Status must be exactly one of: Pending, In progress, Completed."
}
```

---

### 11. GET Non-Integer ID -> Expect 400
```bash
curl -i -X GET "$BASE_URL/api/records/xyz"
```
**Expected Status:** `400 Bad Request`  
**Response Body:**
```json
{
  "message": "Record ID must be a positive whole number."
}
```

---

### 12. POST Malformed JSON -> Expect 400
```bash
curl -i -X POST "$BASE_URL/api/records" \
  -H "Content-Type: application/json" \
  -d '{"title": "Broken JSON",'
```
**Expected Status:** `400 Bad Request`  
**Response Body:**
```json
{
  "message": "Malformed JSON payload in request body."
}
```

---

### 13. Non-Existent Positive ID on GET / PUT / DELETE -> Expect 404
```bash
curl -i -X GET "$BASE_URL/api/records/999999"
curl -i -X PUT "$BASE_URL/api/records/999999" -H "Content-Type: application/json" -d '{"title":"Valid Title","category":"Borrowing","description":"Valid description","status":"Pending"}'
curl -i -X DELETE "$BASE_URL/api/records/999999"
```
**Expected Status:** `404 Not Found`  
**Response Body:**
```json
{
  "message": "Record not found."
}
```

---

### 14. Restart Persistence Verification
1. Create a record via POST.
2. Stop the backend server process (`Ctrl+C`).
3. Restart the server (`npm start`).
4. Execute `GET /api/records/:id` with the ID from step 1.
5. The record is successfully returned because it is stored persistently in the PostgreSQL database.
