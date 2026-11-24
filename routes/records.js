/**
 * Record Routes - Library Service Requests
 * Activity 7 - Mulungushi University ICT251
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

const VALID_STATUSES = ["Pending", "In progress", "Completed"];

/**
 * Validate that an id parameter is a positive whole number
 */
function isValidId(idParam) {
  return /^[1-9]\d*$/.test(String(idParam));
}

/**
 * Validate the four editable fields according to shared data agreement.
 * Returns null if valid, or an error message string if invalid.
 */
function validateRecordPayload(body) {
  const { title, category, description, status } = body;

  // Check types before trimming
  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof description !== "string" ||
    typeof status !== "string"
  ) {
    return "All fields (title, category, description, status) must be provided as strings.";
  }

  const trimmedTitle = title.trim();
  const trimmedCategory = category.trim();
  const trimmedDescription = description.trim();
  const trimmedStatus = status.trim();

  if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
    return "Title must have 3 to 80 characters.";
  }

  if (trimmedCategory.length < 2 || trimmedCategory.length > 40) {
    return "Category must have 2 to 40 characters.";
  }

  if (trimmedDescription.length < 5 || trimmedDescription.length > 300) {
    return "Description must have 5 to 300 characters.";
  }

  if (!VALID_STATUSES.includes(trimmedStatus)) {
    return "Status must be exactly one of: Pending, In progress, Completed.";
  }

  return null;
}

/**
 * GET /api/records
 * Purpose: Read all records ordered by id.
 * Status: 200 OK
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records ORDER BY id ASC;"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/records/:id
 * Purpose: Read one record by id.
 * Status: 200 OK | 400 Bad Request | 404 Not Found
 */
router.get("/:id", async (req, res, next) => {
  const idParam = req.params.id;

  if (!isValidId(idParam)) {
    return res.status(400).json({ message: "Record ID must be a positive whole number." });
  }

  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records WHERE id = $1;",
      [parseInt(idParam, 10)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/records
 * Purpose: Create a new record. Any client-supplied id is ignored.
 * Status: 201 Created | 400 Bad Request
 */
router.post("/", async (req, res, next) => {
  const validationError = validateRecordPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const trimmedTitle = req.body.title.trim();
  const trimmedCategory = req.body.category.trim();
  const trimmedDescription = req.body.description.trim();
  const trimmedStatus = req.body.status.trim();

  try {
    const result = await pool.query(
      "INSERT INTO records (title, category, description, status) VALUES ($1, $2, $3, $4) RETURNING id, title, category, description, status;",
      [trimmedTitle, trimmedCategory, trimmedDescription, trimmedStatus]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/records/:id
 * Purpose: Update an existing record. Replaces all four editable fields.
 * Status: 200 OK | 400 Bad Request | 404 Not Found
 */
router.put("/:id", async (req, res, next) => {
  const idParam = req.params.id;

  if (!isValidId(idParam)) {
    return res.status(400).json({ message: "Record ID must be a positive whole number." });
  }

  const validationError = validateRecordPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const numericId = parseInt(idParam, 10);
  const trimmedTitle = req.body.title.trim();
  const trimmedCategory = req.body.category.trim();
  const trimmedDescription = req.body.description.trim();
  const trimmedStatus = req.body.status.trim();

  try {
    const result = await pool.query(
      "UPDATE records SET title = $1, category = $2, description = $3, status = $4 WHERE id = $5 RETURNING id, title, category, description, status;",
      [trimmedTitle, trimmedCategory, trimmedDescription, trimmedStatus, numericId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/records/:id
 * Purpose: Delete an existing record by id.
 * Status: 200 OK | 400 Bad Request | 404 Not Found
 */
router.delete("/:id", async (req, res, next) => {
  const idParam = req.params.id;

  if (!isValidId(idParam)) {
    return res.status(400).json({ message: "Record ID must be a positive whole number." });
  }

  const numericId = parseInt(idParam, 10);

  try {
    const result = await pool.query(
      "DELETE FROM records WHERE id = $1 RETURNING id;",
      [numericId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
