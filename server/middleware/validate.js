const { body, param, query, validationResult } = require("express-validator");

// Collect errors and short-circuit if any
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error:   "Validation failed.",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
const loginRules = [
  body("email")
    .isEmail().withMessage("Valid email address required.")
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage("Email too long."),
  body("password")
    .isLength({ min: 6, max: 128 }).withMessage("Password must be 6–128 characters."),
];

// ── Users ─────────────────────────────────────────────────────────────────────
const createUserRules = [
  body("name")
    .trim().escape()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters."),
  body("email")
    .isEmail().withMessage("Valid email required.")
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage("Email too long."),
  body("password")
    .isLength({ min: 8, max: 128 }).withMessage("Password must be 8–128 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/).withMessage("Password must contain at least one number."),
  body("role")
    .isIn(["superadmin", "manager", "analyst", "sales"])
    .withMessage("Role must be one of: superadmin, manager, analyst, sales."),
];

const updateUserRules = [
  param("id").notEmpty().withMessage("User ID is required."),
  body("name")
    .optional().trim().escape()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters."),
  body("role")
    .optional()
    .isIn(["superadmin", "manager", "analyst", "sales"])
    .withMessage("Invalid role."),
  body("active")
    .optional().isBoolean().withMessage("Active must be true or false."),
];

const userIdRule = [
  param("id").notEmpty().withMessage("User ID required."),
];

// ── Reports ───────────────────────────────────────────────────────────────────
const generateReportRules = [
  body("name")
    .trim().escape()
    .isLength({ min: 2, max: 200 }).withMessage("Report name must be 2–200 characters."),
  body("type")
    .isIn(["PDF", "Excel", "CSV"]).withMessage("Type must be PDF, Excel, or CSV."),
];

// ── Alerts ────────────────────────────────────────────────────────────────────
const alertIdRule = [
  param("id").notEmpty().withMessage("Alert ID required."),
];

// ── Query params ──────────────────────────────────────────────────────────────
const paginationRules = [
  query("page")
    .optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
  query("limit")
    .optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100."),
];

module.exports = {
  validate,
  loginRules,
  createUserRules,
  updateUserRules,
  userIdRule,
  generateReportRules,
  alertIdRule,
  paginationRules,
};
