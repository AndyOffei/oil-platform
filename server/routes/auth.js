const express   = require("express");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const prisma    = require("../lib/db");
const { JWT_SECRET, verifyToken } = require("../middleware/auth");
const { loginLimiter }            = require("../middleware/security");
const { loginRules, validate }    = require("../middleware/validate");

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // Generic message — don't reveal whether email exists
    if (!user) return res.status(401).json({ error: "Invalid credentials." });
    if (!user.active) return res.status(403).json({ error: "Account disabled. Contact your administrator." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h", issuer: "oilintel-api", audience: "oilintel-app" }
    );

    console.log(`[AUTH] Login: ${user.email} (${user.role}) from ${req.ip}`);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err.message);
    res.status(500).json({ error: "Authentication error." });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });
    const { password: _, ...safe } = user;
    res.json(safe);
  } catch {
    res.status(500).json({ error: "Could not fetch user." });
  }
});

// POST /api/auth/logout
router.post("/logout", verifyToken, (req, res) => {
  console.log(`[AUTH] Logout: ${req.user.email} from ${req.ip}`);
  res.json({ message: "Logged out successfully." });
});

module.exports = router;
